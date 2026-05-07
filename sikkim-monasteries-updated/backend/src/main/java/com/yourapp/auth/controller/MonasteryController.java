package com.yourapp.auth.controller;

import com.yourapp.auth.model.Monastery;
import com.yourapp.auth.repository.MonasteryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/monasteries")
public class MonasteryController {

    @Autowired
    private MonasteryRepository monasteryRepository;

    // GET /api/monasteries — all monasteries (public)
    @GetMapping
    public List<Monastery> getAll() {
        return monasteryRepository.findAll();
    }

    // GET /api/monasteries/{slug} — single monastery by slug (public)
    @GetMapping("/{slug}")
    public ResponseEntity<Monastery> getBySlug(@PathVariable String slug) {
        return monasteryRepository.findBySlug(slug)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // POST /api/monasteries — admin only
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Monastery> create(@RequestBody Monastery monastery) {
        return ResponseEntity.status(201).body(monasteryRepository.save(monastery));
    }

    // PUT /api/monasteries/{id} — admin only
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Monastery> update(@PathVariable Long id, @RequestBody Monastery updated) {
        return monasteryRepository.findById(id).map(m -> {
            updated.setId(id);
            return ResponseEntity.ok(monasteryRepository.save(updated));
        }).orElse(ResponseEntity.notFound().build());
    }

    // DELETE /api/monasteries/{id} — admin only
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        monasteryRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
