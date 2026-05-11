package com.mediresponse.service;

import com.mediresponse.dto.TripRequest;
import com.mediresponse.model.ActiveTrip;
import com.mediresponse.model.Hospital;
import com.mediresponse.repository.ActiveTripRepository;
import com.mediresponse.repository.HospitalRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class TripService {

    private final ActiveTripRepository tripRepository;
    private final HospitalRepository hospitalRepository;

    public TripService(ActiveTripRepository tripRepository,
                       HospitalRepository hospitalRepository) {
        this.tripRepository = tripRepository;
        this.hospitalRepository = hospitalRepository;
    }

    public ActiveTrip createTrip(TripRequest request) {
        Hospital hospital = hospitalRepository.findById(request.getHospitalId())
                .orElseThrow(() -> new RuntimeException("Hospital not found"));

        ActiveTrip trip = new ActiveTrip();
        trip.setAmbulanceId(request.getAmbulanceId());
        trip.setParamedicName(request.getParamedicName());
        trip.setPatientName(request.getPatientName());
        trip.setPatientAge(request.getPatientAge());
        trip.setPatientGender(request.getPatientGender());
        trip.setBloodGroup(request.getBloodGroup());
        trip.setSymptoms(request.getSymptoms());
        trip.setVitals(request.getVitals());
        trip.setSeverity(request.getSeverity());
        trip.setTriageSummary(request.getTriageSummary());
        trip.setRecommendedSpecialists(request.getRecommendedSpecialists());
        trip.setEquipmentNeeded(request.getEquipmentNeeded());
        trip.setHospital(hospital);
        trip.setStatus(ActiveTrip.TripStatus.EN_ROUTE);
        trip.setStartTime(LocalDateTime.now());

        return tripRepository.save(trip);
    }

    public List<ActiveTrip> findActiveTrips() {
        return tripRepository.findAllByOrderByStartTimeDesc();
    }

    public ActiveTrip markArrived(Long id) {
        ActiveTrip trip = tripRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Trip not found"));
        trip.setStatus(ActiveTrip.TripStatus.ARRIVED);
        return tripRepository.save(trip);
    }
}
