package com.yourapp.auth.repository;

import com.yourapp.auth.model.SessionRegistration;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface SessionRegistrationRepository extends JpaRepository<SessionRegistration, Long> {
    List<SessionRegistration> findByUserEmail(String email);
    Optional<SessionRegistration> findByUserEmailAndSessionId(String email, Long sessionId);
    boolean existsByUserEmailAndSessionId(String email, Long sessionId);
}
