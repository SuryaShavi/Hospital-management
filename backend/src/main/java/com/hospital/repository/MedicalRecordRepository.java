package com.hospital.repository;

import com.hospital.model.MedicalRecord;
import com.hospital.model.Patient;
import com.hospital.model.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MedicalRecordRepository extends JpaRepository<MedicalRecord, Long> {
    List<MedicalRecord> findByPatient(Patient patient);
    
    @Query("SELECT m FROM MedicalRecord m WHERE m.patient.id = :patientId")
    List<MedicalRecord> findByPatientId(@Param("patientId") Long patientId);
    
    @Query("SELECT m FROM MedicalRecord m WHERE m.patient.doctor.id = :doctorId")
    List<MedicalRecord> findByPatientDoctorId(@Param("doctorId") Long doctorId);
}
