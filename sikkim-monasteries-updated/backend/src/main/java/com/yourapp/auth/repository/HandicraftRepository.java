package com.yourapp.auth.repository;

import com.yourapp.auth.model.Handicraft;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface HandicraftRepository extends JpaRepository<Handicraft, Long> {
    List<Handicraft> findByAvailableTrue();
    List<Handicraft> findByMonastery(String monastery);
    List<Handicraft> findByCategory(String category);
}
