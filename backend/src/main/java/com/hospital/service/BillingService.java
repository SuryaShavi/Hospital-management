package com.hospital.service;

import com.hospital.model.Billing;
import com.hospital.model.Patient;
import com.hospital.repository.BillingRepository;
import com.hospital.repository.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BillingService {

    @Autowired
    private BillingRepository billingRepository;

    @Autowired
    private PatientRepository patientRepository;

    public List<Billing> getAllBillings() {
        return billingRepository.findAll();
    }

    public Optional<Billing> getBillingById(@NonNull Long id) {
        return billingRepository.findById(id);
    }

    public Billing saveBilling(Billing billing) {
        return billingRepository.save(billing);
    }

    public void deleteBilling(@NonNull Long id) {
        billingRepository.deleteById(id);
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
        // Get all patients assigned to this doctor
        List<Patient> doctorPatients = patientRepository.findAll().stream()
                .filter(p -> p.getDoctor() != null && p.getDoctor().equals(String.valueOf(doctorId)))
                .toList();
        
        // Get all billing records for these patients
        return billingRepository.findAll().stream()
                .filter(b -> doctorPatients.stream()
                        .anyMatch(p -> p.getId().equals(b.getPatient() != null ? b.getPatient().getId() : null)))
                .toList();
    }
}

