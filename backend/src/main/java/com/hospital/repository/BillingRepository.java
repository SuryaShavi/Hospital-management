package com.hospital.repository;

import com.hospital.model.Billing;
import com.hospital.model.Patient;
import com.hospital.model.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BillingRepository extends JpaRepository<Billing, Long> {
    List<Billing> findByPatient(Patient patient);
    
    @Query("SELECT b FROM Billing b WHERE b.patient.id = :patientId")
    List<Billing> findByPatientId(@Param("patientId") Long patientId);
    
    List<Billing> findByPatientIn(List<Patient> patients);
    
    @Query("SELECT b FROM Billing b WHERE b.patient.doctor.id = :doctorId")
    List<Billing> findByPatientDoctorId(@Param("doctorId") Long doctorId);
}
