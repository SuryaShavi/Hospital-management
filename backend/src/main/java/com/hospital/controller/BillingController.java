package com.hospital.controller;

import com.hospital.model.Billing;
import com.hospital.service.BillingService;
import com.hospital.service.UserContextService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/billings")
public class BillingController {

    @Autowired
    private BillingService billingService;

    @Autowired
    private UserContextService userContextService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'RECEPTIONIST')")
    public List<Billing> getAllBillings() {
        return billingService.getAllBillings();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'RECEPTIONIST')")
    public ResponseEntity<Billing> getBillingById(@PathVariable Long id) {
        return billingService.getBillingById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONIST')")
    public Billing createBilling(@Valid @RequestBody Billing billing) {
        return billingService.saveBilling(billing);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONIST')")
    public ResponseEntity<Billing> updateBilling(@PathVariable Long id, @Valid @RequestBody Billing billing) {
        return billingService.getBillingById(id)
                .map(existingBilling -> {
                    billing.setId(id);
                    return ResponseEntity.ok(billingService.saveBilling(billing));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteBilling(@PathVariable Long id) {
        if (billingService.getBillingById(id).isPresent()) {
            billingService.deleteBilling(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    // ========== Role-based endpoints for logged-in users ==========

    /**
     * Get billing records for the current logged-in patient
     * GET /api/billings/my-billings
     */
    @GetMapping("/my-billings")
    @PreAuthorize("hasAnyRole('PATIENT', 'DOCTOR')")
    public ResponseEntity<List<Billing>> getMyBillings() {
        if (userContextService.isPatient()) {
            return userContextService.getCurrentPatient()
                    .map(patient -> ResponseEntity.ok(billingService.getBillingsByPatientId(patient.getId())))
                    .orElse(ResponseEntity.notFound().build());
        } else if (userContextService.isDoctor()) {
            // Doctors can see bills for their patients
            return userContextService.getCurrentDoctor()
                    .map(doctor -> ResponseEntity.ok(billingService.getBillingsByDoctorPatients(doctor.getId())))
                    .orElse(ResponseEntity.notFound().build());
        }
        return ResponseEntity.ok().build();
    }
}

