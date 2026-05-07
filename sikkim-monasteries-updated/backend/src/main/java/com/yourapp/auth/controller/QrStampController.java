package com.yourapp.auth.controller;

import com.yourapp.auth.model.Monastery;
import com.yourapp.auth.model.QrStamp;
import com.yourapp.auth.model.User;
import com.yourapp.auth.repository.MonasteryRepository;
import com.yourapp.auth.repository.QrStampRepository;
import com.yourapp.auth.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/stamps")
@CrossOrigin(origins = "http://localhost:5173")
public class QrStampController {

    @Autowired private QrStampRepository stampRepository;
    @Autowired private MonasteryRepository monasteryRepository;
    @Autowired private UserRepository userRepository;

    // GET /api/stamps/my — get all stamps for logged-in user
    @GetMapping("/my")
    public ResponseEntity<?> getMyStamps(@AuthenticationPrincipal UserDetails userDetails) {
        String email = userDetails.getUsername();
        List<QrStamp> stamps = stampRepository.findByUserEmail(email);
        long total = monasteryRepository.count();
        return ResponseEntity.ok(Map.of(
                "stamps", stamps,
                "count", stamps.size(),
                "total", total
        ));
    }

    // POST /api/stamps/scan — scan a QR code for a monastery
    @PostMapping("/scan")
    public ResponseEntity<?> scanQr(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody Map<String, String> body) {

        String email = userDetails.getUsername();
        String qrCode = body.get("qrCode"); // monastery slug used as QR code

        Optional<Monastery> monasteryOpt = monasteryRepository.findBySlug(qrCode);
        if (monasteryOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid QR code"));
        }

        Monastery monastery = monasteryOpt.get();

        // Check if already stamped
        Optional<QrStamp> existing = stampRepository.findByUserEmailAndMonasteryId(email, monastery.getId());
        if (existing.isPresent()) {
            return ResponseEntity.ok(Map.of(
                    "message", "Already stamped! You visited " + monastery.getName(),
                    "alreadyStamped", true,
                    "stamp", existing.get()
            ));
        }

        User user = userRepository.findByEmail(email).orElseThrow();

        QrStamp stamp = QrStamp.builder()
                .user(user)
                .monastery(monastery)
                .stampedAt(LocalDateTime.now())
                .qrCode(qrCode)
                .build();

        QrStamp saved = stampRepository.save(stamp);

        return ResponseEntity.status(201).body(Map.of(
                "message", "Stamp collected! Welcome to " + monastery.getName(),
                "alreadyStamped", false,
                "stamp", saved
        ));
    }
}
