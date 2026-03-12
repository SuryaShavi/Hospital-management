package com.hospital.controller;

import com.hospital.dto.BillingDTO;
import com.hospital.model.Billing;
import com.hospital.service.BillingService;
import com.hospital.service.UserContextService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api/billings")
@RequiredArgsConstructor
public class BillingController {

    private final BillingService billingService;
    private final UserContextService userContextService;

@GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'RECEPTIONIST')")
    public List<BillingDTO> getAllBillings() {
        return billingService.getAllBillingDTOs();
    }

    /**
     * Get all billings DTO list for ADMIN/RECEPTIONIST my-billings (no auth context needed)
     */
    @GetMapping("/all")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONIST')")
    public List<BillingDTO> getAllBillingsForAdmin() {
        return billingService.getAllBillingDTOs();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'RECEPTIONIST')")
    public ResponseEntity<BillingDTO> getBillingById(@PathVariable Long id) {
        BillingDTO dto = billingService.getBillingById(id)
                .map(this::toDto)
                .orElse(null);
        return dto != null ? ResponseEntity.ok(dto) : ResponseEntity.notFound().build();
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONIST')")
    public BillingDTO createBilling(@Valid @RequestBody Billing billing) {
        Billing saved = billingService.saveBilling(billing);
        return toDto(saved);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONIST')")
    public ResponseEntity<BillingDTO> updateBilling(@PathVariable Long id, @Valid @RequestBody Billing billing) {
        return billingService.getBillingById(id)
                .map(existingBilling -> {
                    billing.setId(id);
                    Billing saved = billingService.saveBilling(billing);
                    return ResponseEntity.ok(toDto(saved));
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

    private BillingDTO toDto(Billing billing) {
        if (billing == null) return null;
        BillingDTO dto = new BillingDTO();
        dto.setId(billing.getId());
        if (billing.getPatient() != null) {
            dto.setPatientId(billing.getPatient().getId());
            dto.setPatientName(billing.getPatient().getName());
        }
        dto.setTreatment(billing.getTreatment());
        dto.setAmount(billing.getAmount());
        dto.setPaymentStatus(billing.getPaymentStatus());
        dto.setDate(billing.getDate());
        dto.setMethod(billing.getMethod());
        return dto;
    }

    // ========== Role-based endpoints for logged-in users ==========

    /**
     * Get billing records for the current logged-in patient
     * GET /api/billings/my-billings
     */
    @GetMapping("/my-billings")
@PreAuthorize("hasAnyRole('ADMIN', 'PATIENT', 'DOCTOR', 'RECEPTIONIST')")
    public ResponseEntity<List<BillingDTO>> getMyBillings() {
        // ADMIN sees all billings
        if (userContextService.isAdmin()) {
            return ResponseEntity.ok(billingService.getAllBillingDTOs());
        }
        // PATIENT sees own billings
        if (userContextService.isPatient()) {
            return userContextService.getCurrentPatient()
                    .map(patient -> ResponseEntity.ok(billingService.getBillingsByPatientIdDTO(patient.getId())))
                    .orElse(ResponseEntity.ok(Collections.emptyList()));
        }
        // DOCTOR sees patients' billings
        if (userContextService.isDoctor()) {
            return userContextService.getCurrentDoctor()
                    .map(doctor -> ResponseEntity.ok(billingService.getBillingsByDoctorPatientsDTO(doctor.getId())))
                    .orElse(ResponseEntity.ok(Collections.emptyList()));
        }
        // RECEPTIONIST sees all billings
        return ResponseEntity.ok(billingService.getAllBillingDTOs());
    }
}

