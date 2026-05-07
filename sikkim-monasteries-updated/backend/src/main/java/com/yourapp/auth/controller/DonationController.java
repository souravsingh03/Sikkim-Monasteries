package com.yourapp.auth.controller;

import com.yourapp.auth.dto.DonationRequest;
import com.yourapp.auth.model.Donation;
import com.yourapp.auth.service.DonationService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/donations")
@CrossOrigin(origins = "http://localhost:3000")
public class DonationController {

    @Autowired
    private DonationService donationService;

    /**
     * POST /api/donations
     * Body: { name, email, amount, purpose, paymentMethod }
     * Requires auth (user must be logged in to donate)
     */
    @PostMapping
    public ResponseEntity<Map<String, Object>> submitDonation(
            @Valid @RequestBody DonationRequest request) {
        Map<String, Object> result = donationService.submitDonation(request);
        return ResponseEntity.status(201).body(result);
    }

    /**
     * GET /api/donations/my
     * Returns donation history for the currently logged-in user
     */
    @GetMapping("/my")
    public ResponseEntity<List<Donation>> getMyDonations() {
        return ResponseEntity.ok(donationService.getMyDonations());
    }
}
