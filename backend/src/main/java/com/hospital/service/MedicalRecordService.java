package com.hospital.service;

import com.hospital.model.MedicalRecord;
import com.hospital.model.Patient;
import com.hospital.repository.MedicalRecordRepository;
import com.hospital.repository.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MedicalRecordService {

    @Autowired
    private MedicalRecordRepository medicalRecordRepository;

    @Autowired
    private PatientRepository patientRepository;

    public List<MedicalRecord> getAllMedicalRecords() {
        return medicalRecordRepository.findAll();
    }

    public Optional<MedicalRecord> getMedicalRecordById(@NonNull Long id) {
        return medicalRecordRepository.findById(id);
    }

    public MedicalRecord saveMedicalRecord(MedicalRecord medicalRecord) {
        return medicalRecordRepository.save(medicalRecord);
    }

    public void deleteMedicalRecord(@NonNull Long id) {
        medicalRecordRepository.deleteById(id);
    }

    /**
     * Get medical records for a specific patient
     */
    public List<MedicalRecord> getMedicalRecordsByPatient(Patient patient) {
        return medicalRecordRepository.findByPatient(patient);
    }

    /**
     * Get medical records for a specific patient by ID
     */
    public List<MedicalRecord> getMedicalRecordsByPatientId(Long patientId) {
        return medicalRecordRepository.findByPatientId(patientId);
    }

    /**
     * Get medical records for patients assigned to a specific doctor
     */
    public List<MedicalRecord> getMedicalRecordsByDoctorPatients(Long doctorId) {
        // Get all patients assigned to this doctor
        List<Patient> doctorPatients = patientRepository.findAll().stream()
                .filter(p -> p.getDoctor() != null && p.getDoctor().equals(String.valueOf(doctorId)))
                .toList();
        
        // Get all medical records for these patients
        return medicalRecordRepository.findAll().stream()
                .filter(m -> doctorPatients.stream()
                        .anyMatch(p -> p.getId().equals(m.getPatient() != null ? m.getPatient().getId() : null)))
                .toList();
    }
}

