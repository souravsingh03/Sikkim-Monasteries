package com.medilink.controller;

import com.medilink.dto.TripRequest;
import com.medilink.model.ActiveTrip;
import com.medilink.service.TripService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trips")
@CrossOrigin(origins = "http://localhost:3000")
public class TripController {

    private final TripService tripService;

    public TripController(TripService tripService) {
        this.tripService = tripService;
    }

    // POST /api/trips - called when ambulance is dispatched
    @PostMapping
    public ResponseEntity<ActiveTrip> createTrip(@Valid @RequestBody TripRequest request) {
        return ResponseEntity.ok(tripService.createTrip(request));
    }

    // GET /api/trips/active - hospital dashboard polling
    @GetMapping("/active")
    public ResponseEntity<List<ActiveTrip>> getActiveTrips() {
        return ResponseEntity.ok(tripService.findActiveTrips());
    }

    // PATCH /api/trips/{id}/arrived
    @PatchMapping("/{id}/arrived")
    public ResponseEntity<ActiveTrip> markArrived(@PathVariable Long id) {
        return ResponseEntity.ok(tripService.markArrived(id));
    }
}
