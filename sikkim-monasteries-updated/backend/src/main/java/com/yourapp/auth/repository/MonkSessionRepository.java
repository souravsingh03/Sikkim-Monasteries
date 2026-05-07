package com.yourapp.auth.repository;

import com.yourapp.auth.model.MonkSession;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MonkSessionRepository extends JpaRepository<MonkSession, Long> {
    List<MonkSession> findByStatus(String status);
    List<MonkSession> findByMonastery(String monastery);
}
