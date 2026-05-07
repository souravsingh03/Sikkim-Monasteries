package com.yourapp.auth.controller;

import com.yourapp.auth.dto.NewsletterRequest;
import com.yourapp.auth.service.NewsletterService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/newsletter")
@CrossOrigin(origins = "http://localhost:3000")
public class NewsletterController {

    @Autowired
    private NewsletterService newsletterService;

    /**
     * POST /api/newsletter/subscribe
     * Body: { "email": "user@example.com" }
     * Public endpoint — no auth required
     */
    @PostMapping("/subscribe")
    public ResponseEntity<Map<String, String>> subscribe(
            @Valid @RequestBody NewsletterRequest request) {
        Map<String, String> result = newsletterService.subscribe(request.getEmail());
        return ResponseEntity.ok(result);
    }
}
