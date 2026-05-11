package com.mediresponse.repository;

import com.mediresponse.model.ActiveTrip;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ActiveTripRepository extends JpaRepository<ActiveTrip, Long> {
    List<ActiveTrip> findByStatusOrderByStartTimeDesc(ActiveTrip.TripStatus status);
    List<ActiveTrip> findAllByOrderByStartTimeDesc();
}
