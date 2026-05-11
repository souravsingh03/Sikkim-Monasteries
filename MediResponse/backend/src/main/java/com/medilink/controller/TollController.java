package com.medilink.controller;

import com.medilink.model.TollAlert;
import com.medilink.service.TollAlertService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/toll-alerts")
@CrossOrigin(origins = "http://localhost:3000")
public class TollController {

    private final TollAlertService tollAlertService;

    public TollController(TollAlertService tollAlertService) {
        this.tollAlertService = tollAlertService;
    }

    // GET /api/toll-alerts
    @GetMapping
    public ResponseEntity<List<TollAlert>> getAlerts() {
        return ResponseEntity.ok(tollAlertService.findAll());
    }

    // PATCH /api/toll-alerts/{id}/clear
    @PatchMapping("/{id}/clear")
    public ResponseEntity<TollAlert> clearAlert(@PathVariable Long id) {
        return ResponseEntity.ok(tollAlertService.clearAlert(id));
    }
}
