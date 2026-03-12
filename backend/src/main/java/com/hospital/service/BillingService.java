package com.hospital.service;

import com.hospital.model.Billing;
import com.hospital.model.Patient;
import com.hospital.repository.BillingRepository;
import com.hospital.repository.PatientRepository;
import com.hospital.dto.BillingDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Billing Service with constructor injection and optimized methods
 */
@Service
@RequiredArgsConstructor
@Transactional
public class BillingService {

    private final BillingRepository billingRepository;
    private final PatientRepository patientRepository;

    /**
     * Convert Billing entity to DTO (safe handling for lazy-loaded Patient)
     */
    private BillingDTO toDto(Billing billing) {
        if (billing == null) return null;
        
        BillingDTO dto = new BillingDTO();
        dto.setId(billing.getId());
        
        // Safe patient handling - initialize if needed or use null-safe operations
        Long patientId = null;
        String patientName = "Unknown Patient";
        try {
            if (billing.getPatient() != null && billing.getPatient().getId() != null) {
                patientId = billing.getPatient().getId();
                patientName = billing.getPatient().getName();
            }
        } catch (Exception e) {
            // LazyInitializationException handling - patient not loaded
            // Could fetch patient separately if needed
        }
        
        dto.setPatientId(patientId);
        dto.setPatientName(patientName);
        dto.setTreatment(billing.getTreatment());
        dto.setAmount(billing.getAmount());
        dto.setPaymentStatus(billing.getPaymentStatus());
        dto.setDate(billing.getDate());
        dto.setMethod(billing.getMethod());
        return dto;
    }

    public Optional<Billing> getBillingById(@NonNull Long id) {
        return billingRepository.findById(id);
    }

    public Billing saveBilling(Billing billing) {
        // Ensure patient exists before saving
        if (billing.getPatient() != null && billing.getPatient().getId() != null) {
            Optional<Patient> patientOpt = patientRepository.findById(billing.getPatient().getId());
            patientOpt.ifPresent(billing::setPatient);
        }
        return billingRepository.save(billing);
    }

    public void deleteBilling(@NonNull Long id) {
        if (billingRepository.existsById(id)) {
            billingRepository.deleteById(id);
        }
    }

    /**
     * Get billing records for a specific patient
     */
    public List<Billing> getBillingsByPatient(Patient patient) {
        return billingRepository.findByPatient(patient);
    }

    /**
     * Get billing records for a specific patient by ID
     */
    public List<Billing> getBillingsByPatientId(Long patientId) {
        return billingRepository.findByPatientId(patientId);
    }

    /**
     * Get billing records for patients assigned to a specific doctor
     */
    public List<Billing> getBillingsByDoctorPatients(Long doctorId) {
        return billingRepository.findByPatientDoctorId(doctorId);
    }

    public List<BillingDTO> getAllBillingDTOs() {
        return billingRepository.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public List<BillingDTO> getBillingsByPatientIdDTO(Long patientId) {
        return getBillingsByPatientId(patientId).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public List<BillingDTO> getBillingsByDoctorPatientsDTO(Long doctorId) {
        return getBillingsByDoctorPatients(doctorId).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }
}

