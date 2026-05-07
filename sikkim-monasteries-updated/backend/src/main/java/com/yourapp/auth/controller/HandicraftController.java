package com.yourapp.auth.controller;

import com.yourapp.auth.model.Handicraft;
import com.yourapp.auth.repository.HandicraftRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/handicrafts")
@CrossOrigin(origins = "http://localhost:5173")
public class HandicraftController {

    @Autowired
    private HandicraftRepository handicraftRepository;

    // GET /api/handicrafts — all available handicrafts (public)
    @GetMapping
    public List<Handicraft> getAll() {
        return handicraftRepository.findByAvailableTrue();
    }

    // GET /api/handicrafts/{id}
    @GetMapping("/{id}")
    public ResponseEntity<Handicraft> getById(@PathVariable Long id) {
        return handicraftRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // GET /api/handicrafts/monastery/{name}
    @GetMapping("/monastery/{monastery}")
    public List<Handicraft> getByMonastery(@PathVariable String monastery) {
        return handicraftRepository.findByMonastery(monastery);
    }

    // POST /api/handicrafts — admin only
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Handicraft> create(@RequestBody Handicraft handicraft) {
        handicraft.setAvailable(true);
        return ResponseEntity.status(201).body(handicraftRepository.save(handicraft));
    }

    // PUT /api/handicrafts/{id} — admin only
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Handicraft> update(@PathVariable Long id, @RequestBody Handicraft updated) {
        return handicraftRepository.findById(id).map(h -> {
            updated.setId(id);
            return ResponseEntity.ok(handicraftRepository.save(updated));
        }).orElse(ResponseEntity.notFound().build());
    }

    // DELETE /api/handicrafts/{id} — admin only
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        handicraftRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
