package com.medilink.repository;

import com.medilink.model.TollAlert;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TollAlertRepository extends JpaRepository<TollAlert, Long> {
    List<TollAlert> findAllByOrderByCreatedAtDesc();
}
