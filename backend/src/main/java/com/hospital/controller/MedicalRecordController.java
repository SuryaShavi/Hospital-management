package com.hospital.controller;

import com.hospital.model.MedicalRecord;
import com.hospital.service.MedicalRecordService;
import com.hospital.service.UserContextService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/medical-records")
public class MedicalRecordController {

    @Autowired
    private MedicalRecordService medicalRecordService;

    @Autowired
    private UserContextService userContextService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR')")
    public List<MedicalRecord> getAllMedicalRecords() {
        return medicalRecordService.getAllMedicalRecords();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR')")
    public ResponseEntity<MedicalRecord> getMedicalRecordById(@PathVariable Long id) {
        return medicalRecordService.getMedicalRecordById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR')")
    public MedicalRecord createMedicalRecord(@Valid @RequestBody MedicalRecord medicalRecord) {
        return medicalRecordService.saveMedicalRecord(medicalRecord);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR')")
    public ResponseEntity<MedicalRecord> updateMedicalRecord(@PathVariable Long id, @Valid @RequestBody MedicalRecord medicalRecord) {
        return medicalRecordService.getMedicalRecordById(id)
                .map(existingRecord -> {
                    medicalRecord.setId(id);
                    return ResponseEntity.ok(medicalRecordService.saveMedicalRecord(medicalRecord));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteMedicalRecord(@PathVariable Long id) {
        if (medicalRecordService.getMedicalRecordById(id).isPresent()) {
            medicalRecordService.deleteMedicalRecord(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    // ========== Role-based endpoints for logged-in users ==========

    /**
     * Get medical records for the current logged-in patient
     * GET /api/medical-records/my-records
     */
    @GetMapping("/my-records")
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<List<MedicalRecord>> getMyRecords() {
        return userContextService.getCurrentPatient()
                .map(patient -> ResponseEntity.ok(medicalRecordService.getMedicalRecordsByPatientId(patient.getId())))
                .orElse(ResponseEntity.notFound().build());
    }
}

