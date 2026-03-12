package com.hospital.service;

import com.hospital.model.MedicalRecord;
import com.hospital.model.Patient;
import com.hospital.repository.MedicalRecordRepository;
import com.hospital.repository.PatientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * MedicalRecord Service with constructor injection
 */
@Service
@RequiredArgsConstructor
public class MedicalRecordService {

    private final MedicalRecordRepository medicalRecordRepository;
    private final PatientRepository patientRepository;

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
        return medicalRecordRepository.findByPatientDoctorId(doctorId);
    }
}
