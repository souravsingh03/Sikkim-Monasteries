package com.yourapp.auth.repository;

import com.yourapp.auth.model.Donation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DonationRepository extends JpaRepository<Donation, Long> {
    List<Donation> findByDonorEmailOrderByCreatedAtDesc(String email);
    List<Donation> findByUserIdOrderByCreatedAtDesc(Long userId);
}
