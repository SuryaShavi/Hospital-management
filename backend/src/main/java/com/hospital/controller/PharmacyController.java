package com.hospital.controller;

import com.hospital.model.Pharmacy;
import com.hospital.service.PharmacyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pharmacy")
@CrossOrigin(origins = "http://localhost:5173")
public class PharmacyController {

    @Autowired
    private PharmacyService pharmacyService;

    @GetMapping
    public List<Pharmacy> getAllMedications() {
        return pharmacyService.getAllMedications();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Pharmacy> getMedicationById(@PathVariable Long id) {
        return pharmacyService.getMedicationById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Pharmacy createMedication(@RequestBody Pharmacy pharmacy) {
        return pharmacyService.saveMedication(pharmacy);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Pharmacy> updateMedication(@PathVariable Long id, @RequestBody Pharmacy pharmacy) {
        return pharmacyService.getMedicationById(id)
                .map(existingPharmacy -> {
                    pharmacy.setId(id);
                    return ResponseEntity.ok(pharmacyService.saveMedication(pharmacy));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMedication(@PathVariable Long id) {
        if (pharmacyService.getMedicationById(id).isPresent()) {
            pharmacyService.deleteMedication(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}

