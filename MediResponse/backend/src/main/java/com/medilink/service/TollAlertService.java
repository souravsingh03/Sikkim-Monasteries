package com.medilink.service;

import com.medilink.model.TollAlert;
import com.medilink.repository.TollAlertRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TollAlertService {

    private final TollAlertRepository tollAlertRepository;

    public TollAlertService(TollAlertRepository tollAlertRepository) {
        this.tollAlertRepository = tollAlertRepository;
    }

    public List<TollAlert> findAll() {
        return tollAlertRepository.findAllByOrderByCreatedAtDesc();
    }

    public TollAlert clearAlert(Long id) {
        TollAlert alert = tollAlertRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Toll alert not found"));
        alert.setCleared(true);
        return tollAlertRepository.save(alert);
    }
}
