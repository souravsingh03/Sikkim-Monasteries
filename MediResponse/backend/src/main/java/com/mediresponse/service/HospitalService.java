package com.mediresponse.service;

import com.mediresponse.model.Hospital;
import com.mediresponse.repository.HospitalRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class HospitalService {

    private final HospitalRepository hospitalRepository;

    public HospitalService(HospitalRepository hospitalRepository) {
        this.hospitalRepository = hospitalRepository;
    }

    public List<Hospital> findAll() {
        return hospitalRepository.findAll();
    }

    public Optional<Hospital> findById(Long id) {
        return hospitalRepository.findById(id);
    }
}
