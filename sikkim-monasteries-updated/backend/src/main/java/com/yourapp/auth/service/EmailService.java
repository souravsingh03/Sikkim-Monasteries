package com.yourapp.auth.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    @Autowired(required = false)   // optional — if mail is not configured, won't crash
    private JavaMailSender mailSender;

    @Value("${spring.mail.from:noreply@sikkim-monasteries.org}")
    private String fromAddress;

    // ── Donation confirmation email ───────────────────────────────
    public void sendDonationConfirmation(String toEmail, String donorName,
                                         BigDecimal amount, String purpose) {
        String subject = "Thank you for your donation — Monasteries of Sikkim";
        String body = String.format(
            """
            Dear %s,

            Thank you for your generous contribution of ₹%s towards "%s".

            Your donation directly supports the preservation of Sikkim's sacred monasteries,
            their communities, and centuries-old cultural heritage.

            We'll keep you informed about how your contribution makes a difference.

            With gratitude,
            The Sikkim Monastery Atlas Team
            heritage@sikkim.org
            """,
            donorName, amount.toPlainString(), purpose
        );
        sendEmail(toEmail, subject, body);
    }

    // ── Newsletter welcome email ──────────────────────────────────
    public void sendNewsletterWelcome(String toEmail) {
        String subject = "You're subscribed — Monasteries of Sikkim";
        String body = """
            Welcome!

            You've successfully subscribed to the Monasteries of Sikkim newsletter.
            
            Each month we share:
            • New monastery discoveries and restoration updates
            • Upcoming festivals and cultural events
            • Mindful travel guides and visitor stories

            Unsubscribe anytime by replying to this email.

            Warm regards,
            The Sikkim Monastery Atlas Team
            """;
        sendEmail(toEmail, subject, body);
    }

    // ── Internal helper ───────────────────────────────────────────
    private void sendEmail(String to, String subject, String body) {
        if (mailSender == null) {
            // Mail not configured — just log (useful in dev)
            log.info("[EMAIL] To: {} | Subject: {} | Body: {}", to, subject, body);
            return;
        }
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromAddress);
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);
            mailSender.send(message);
            log.info("Email sent to {}", to);
        } catch (Exception e) {
            log.error("Failed to send email to {}: {}", to, e.getMessage());
        }
    }
}
