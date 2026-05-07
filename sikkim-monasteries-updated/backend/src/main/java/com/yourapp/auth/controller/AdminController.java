package com.yourapp.auth.controller;

import com.yourapp.auth.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:5173")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired private UserRepository userRepository;
    @Autowired private DonationRepository donationRepository;
    @Autowired private MonasteryRepository monasteryRepository;
    @Autowired private NewsletterRepository newsletterRepository;
    @Autowired private MonkSessionRepository sessionRepository;
    @Autowired private HandicraftRepository handicraftRepository;
    @Autowired private QrStampRepository stampRepository;

    // GET /api/admin/stats — dashboard summary
    @GetMapping("/stats")
    public ResponseEntity<?> getStats() {
        return ResponseEntity.ok(Map.of(
                "totalUsers", userRepository.count(),
                "totalDonations", donationRepository.count(),
                "totalMonasteries", monasteryRepository.count(),
                "newsletterSubscribers", newsletterRepository.count(),
                "totalSessions", sessionRepository.count(),
                "totalHandicrafts", handicraftRepository.count(),
                "totalStamps", stampRepository.count()
        ));
    }

    // GET /api/admin/users — list all users
    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    // GET /api/admin/donations — all donations
    @GetMapping("/donations")
    public ResponseEntity<?> getAllDonations() {
        return ResponseEntity.ok(donationRepository.findAll());
    }

    // GET /api/admin/newsletter — all subscribers
    @GetMapping("/newsletter")
    public ResponseEntity<?> getAllSubscribers() {
        return ResponseEntity.ok(newsletterRepository.findAll());
    }
}
