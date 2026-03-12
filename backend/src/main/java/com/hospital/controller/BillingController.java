package com.hospital.controller;

import com.hospital.dto.BillingDTO;
import com.hospital.model.Billing;
import com.hospital.service.BillingService;
import com.hospital.service.UserContextService;
import com.hospital.repository.PatientRepository;
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
    private final PatientRepository patientRepository;

@GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'RECEPTIONIST')")
    public List<BillingDTO> getAllBillings() {
        // doctors should only see their patients' billings
        if (userContextService.isDoctor()) {
            return userContextService.getCurrentDoctor()
                    .map(doctor -> billingService.getBillingsByDoctorPatientsDTO(doctor.getId()))
                    .orElse(List.of());
        }
        // admin and receptionist see everything
        return billingService.getAllBillingDTOs();
    }

    /**
     * Get all billings DTO list for ADMIN/RECEPTIONIST (no auth context needed)
     */

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONIST')")
    public BillingDTO createBilling(@Valid @RequestBody BillingDTO dto) {
        // convert DTO to entity and save
        Billing billing = dtoToEntity(dto);
        Billing saved = billingService.saveBilling(billing);
        return toDto(saved);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONIST')")
    public ResponseEntity<BillingDTO> updateBilling(@PathVariable Long id, @Valid @RequestBody BillingDTO dto) {
        return billingService.getBillingById(id)
                .map(existingBilling -> {
                    Billing billing = dtoToEntity(dto);
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

    // helper to convert DTO to entity
    private Billing dtoToEntity(BillingDTO dto) {
        Billing billing = new Billing();
        if (dto.getId() != null) {
            billing.setId(dto.getId());
        }
        if (dto.getPatientId() != null) {
            // attempt to load patient reference
            patientRepository.findById(dto.getPatientId())
                    .ifPresent(billing::setPatient);
        }
        billing.setTreatment(dto.getTreatment());
        billing.setAmount(dto.getAmount());
        billing.setPaymentStatus(dto.getPaymentStatus());
        billing.setDate(dto.getDate());
        billing.setMethod(dto.getMethod());
        return billing;
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

