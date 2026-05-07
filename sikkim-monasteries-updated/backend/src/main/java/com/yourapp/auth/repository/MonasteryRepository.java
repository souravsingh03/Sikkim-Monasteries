package com.yourapp.auth.repository;

import com.yourapp.auth.model.Monastery;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface MonasteryRepository extends JpaRepository<Monastery, Long> {
    Optional<Monastery> findBySlug(String slug);
    List<Monastery> findByDistrict(String district);
    List<Monastery> findBySect(String sect);
}
