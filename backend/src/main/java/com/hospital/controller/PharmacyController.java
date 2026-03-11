package com.hospital.controller;

import com.hospital.model.Pharmacy;
import com.hospital.service.PharmacyService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pharmacy")
public class PharmacyController {

    @Autowired
    private PharmacyService pharmacyService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'NURSE')")
    public List<Pharmacy> getAllMedications() {
        return pharmacyService.getAllMedications();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'NURSE')")
    public ResponseEntity<Pharmacy> getMedicationById(@PathVariable Long id) {
        return pharmacyService.getMedicationById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR')")
    public Pharmacy createMedication(@Valid @RequestBody Pharmacy pharmacy) {
        return pharmacyService.saveMedication(pharmacy);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR')")
    public ResponseEntity<Pharmacy> updateMedication(@PathVariable Long id, @Valid @RequestBody Pharmacy pharmacy) {
        return pharmacyService.getMedicationById(id)
                .map(existingPharmacy -> {
                    pharmacy.setId(id);
                    return ResponseEntity.ok(pharmacyService.saveMedication(pharmacy));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteMedication(@PathVariable Long id) {
        if (pharmacyService.getMedicationById(id).isPresent()) {
            pharmacyService.deleteMedication(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}

