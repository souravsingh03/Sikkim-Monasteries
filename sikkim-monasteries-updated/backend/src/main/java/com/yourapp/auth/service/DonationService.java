package com.yourapp.auth.service;

import com.yourapp.auth.dto.DonationRequest;
import com.yourapp.auth.model.Donation;
import com.yourapp.auth.model.User;
import com.yourapp.auth.repository.DonationRepository;
import com.yourapp.auth.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class DonationService {

    @Autowired private DonationRepository donationRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private EmailService emailService;

    // ── Submit a donation ─────────────────────────────────────────
    public Map<String, Object> submitDonation(DonationRequest req) {
        // Optionally link to logged-in user if they're authenticated
        User linkedUser = null;
        try {
            String email = SecurityContextHolder.getContext()
                    .getAuthentication().getName();
            linkedUser = userRepository.findByEmail(email).orElse(null);
        } catch (Exception ignored) { /* guest donation */ }

        Donation donation = Donation.builder()
                .donorName(req.getName())
                .donorEmail(req.getEmail())
                .amount(req.getAmount())
                .purpose(req.getPurpose())
                .paymentMethod(req.getPaymentMethod())
                .status(Donation.DonationStatus.COMPLETED) // Mark complete (real payment gateway would update this)
                .user(linkedUser)
                .build();

        Donation saved = donationRepository.save(donation);

        // Send confirmation email
        emailService.sendDonationConfirmation(
            req.getEmail(), req.getName(), req.getAmount(), req.getPurpose()
        );

        return Map.of(
            "id", saved.getId(),
            "message", "Donation received! A confirmation has been sent to " + req.getEmail()
        );
    }

    // ── Get donations for the current logged-in user ──────────────
    public List<Donation> getMyDonations() {
        String email = SecurityContextHolder.getContext()
                .getAuthentication().getName();
        return donationRepository.findByDonorEmailOrderByCreatedAtDesc(email);
    }
}
