package com.yourapp.auth.service;

import com.yourapp.auth.model.NewsletterSubscriber;
import com.yourapp.auth.repository.NewsletterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class NewsletterService {

    @Autowired private NewsletterRepository newsletterRepository;
    @Autowired private EmailService emailService;

    public Map<String, String> subscribe(String email) {
        // Already subscribed?
        if (newsletterRepository.existsByEmail(email)) {
            return Map.of("message", "You're already subscribed!");
        }

        // Save subscriber
        newsletterRepository.save(
            NewsletterSubscriber.builder().email(email).build()
        );

        // Send welcome email (non-blocking — errors are logged, not thrown)
        emailService.sendNewsletterWelcome(email);

        return Map.of("message", "Subscribed successfully! Check your inbox.");
    }
}
