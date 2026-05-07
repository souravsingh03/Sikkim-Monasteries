package com.yourapp.auth.controller;

import com.yourapp.auth.model.MonkSession;
import com.yourapp.auth.model.SessionRegistration;
import com.yourapp.auth.model.User;
import com.yourapp.auth.repository.MonkSessionRepository;
import com.yourapp.auth.repository.SessionRegistrationRepository;
import com.yourapp.auth.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/sessions")
@CrossOrigin(origins = "http://localhost:5173")
public class MonkSessionController {

    @Autowired private MonkSessionRepository sessionRepository;
    @Autowired private SessionRegistrationRepository registrationRepository;
    @Autowired private UserRepository userRepository;

    // GET /api/sessions — all sessions (public)
    @GetMapping
    public List<MonkSession> getAll() {
        return sessionRepository.findAll();
    }

    // GET /api/sessions/upcoming
    @GetMapping("/upcoming")
    public List<MonkSession> getUpcoming() {
        return sessionRepository.findByStatus("UPCOMING");
    }

    // GET /api/sessions/live
    @GetMapping("/live")
    public List<MonkSession> getLive() {
        return sessionRepository.findByStatus("LIVE");
    }

    // GET /api/sessions/{id}
    @GetMapping("/{id}")
    public ResponseEntity<MonkSession> getById(@PathVariable Long id) {
        return sessionRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // POST /api/sessions/{id}/register — register for a session (requires login)
    @PostMapping("/{id}/register")
    public ResponseEntity<?> register(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {

        String email = userDetails.getUsername();

        if (registrationRepository.existsByUserEmailAndSessionId(email, id)) {
            return ResponseEntity.badRequest().body(Map.of("error", "Already registered for this session"));
        }

        MonkSession session = sessionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Session not found"));

        if (session.getRegisteredCount() >= session.getMaxParticipants()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Session is full"));
        }

        User user = userRepository.findByEmail(email).orElseThrow();

        SessionRegistration reg = SessionRegistration.builder()
                .user(user)
                .session(session)
                .registeredAt(LocalDateTime.now())
                .build();

        registrationRepository.save(reg);

        session.setRegisteredCount(session.getRegisteredCount() + 1);
        sessionRepository.save(session);

        return ResponseEntity.status(201).body(Map.of(
                "message", "Registered for " + session.getTitle(),
                "meetLink", session.getMeetLink()
        ));
    }

    // GET /api/sessions/my — get sessions user registered for
    @GetMapping("/my")
    public ResponseEntity<?> getMyRegistrations(@AuthenticationPrincipal UserDetails userDetails) {
        String email = userDetails.getUsername();
        List<SessionRegistration> regs = registrationRepository.findByUserEmail(email);
        return ResponseEntity.ok(regs);
    }

    // POST /api/sessions — admin only
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MonkSession> create(@RequestBody MonkSession session) {
        session.setRegisteredCount(0);
        session.setStatus("UPCOMING");
        return ResponseEntity.status(201).body(sessionRepository.save(session));
    }

    // PUT /api/sessions/{id} — admin only (update status etc)
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MonkSession> update(@PathVariable Long id, @RequestBody MonkSession updated) {
        return sessionRepository.findById(id).map(s -> {
            updated.setId(id);
            return ResponseEntity.ok(sessionRepository.save(updated));
        }).orElse(ResponseEntity.notFound().build());
    }
}
