package com.yourapp.auth.repository;

import com.yourapp.auth.model.QrStamp;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface QrStampRepository extends JpaRepository<QrStamp, Long> {
    List<QrStamp> findByUserEmail(String email);
    Optional<QrStamp> findByUserEmailAndMonasteryId(String email, Long monasteryId);
    long countByUserEmail(String email);
}
