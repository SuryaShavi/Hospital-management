package com.hospital.controller;

import com.hospital.model.Appointment;
import com.hospital.model.Billing;
import com.hospital.model.MedicalRecord;
import com.hospital.model.Patient;
import com.hospital.service.AppointmentService;
import com.hospital.service.BillingService;
import com.hospital.service.MedicalRecordService;
import com.hospital.service.PatientService;
import com.hospital.service.UserContextService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/patients")
public class PatientController {

    @Autowired
    private PatientService patientService;

    @Autowired
    private UserContextService userContextService;

    @Autowired
    private AppointmentService appointmentService;

    @Autowired
    private MedicalRecordService medicalRecordService;

    @Autowired
    private BillingService billingService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'NURSE')")
    public List<Patient> getAllPatients() {
        // ADMIN and NURSE can see all patients
        if (userContextService.isDoctor()) {
            // doctors should only see their own patients
            return userContextService.getCurrentDoctor()
                    .map(doctor -> patientService.getPatientsByDoctorId(doctor.getId()))
                    .orElse(List.of());
        }
        return patientService.getAllPatients();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'NURSE')")
    public ResponseEntity<Patient> getPatientById(@PathVariable Long id) {
        return patientService.getPatientById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'NURSE')")
    public Patient createPatient(@Valid @RequestBody Patient patient) {
        return patientService.savePatient(patient);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'NURSE')")
    public ResponseEntity<Patient> updatePatient(@PathVariable Long id, @Valid @RequestBody Patient patient) {
        return patientService.getPatientById(id)
                .map(existingPatient -> {
                    patient.setId(id);
                    return ResponseEntity.ok(patientService.savePatient(patient));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR')")
    public ResponseEntity<Void> deletePatient(@PathVariable Long id) {
        if (patientService.getPatientById(id).isPresent()) {
            patientService.deletePatient(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    // ========== Role-based endpoints for logged-in patient ==========

    /**
     * Get current logged-in patient's profile
     * GET /api/patients/me
     */
    @GetMapping("/me")
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<Patient> getMyProfile() {
        return userContextService.getCurrentPatient()
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Get appointments for the current logged-in patient
     * GET /api/patients/me/appointments
     */
    @GetMapping("/me/appointments")
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<List<Appointment>> getMyAppointments() {
        return userContextService.getCurrentPatient()
                .map(patient -> ResponseEntity.ok(appointmentService.getAppointmentsByPatientId(patient.getId())))
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Get medical records for the current logged-in patient
     * GET /api/patients/me/medical-records
     */
    @GetMapping("/me/medical-records")
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<List<MedicalRecord>> getMyMedicalRecords() {
        return userContextService.getCurrentPatient()
                .map(patient -> ResponseEntity.ok(medicalRecordService.getMedicalRecordsByPatientId(patient.getId())))
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Get billing records for the current logged-in patient
     * GET /api/patients/me/billings
     */
    @GetMapping("/me/billings")
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<List<Billing>> getMyBillings() {
        return userContextService.getCurrentPatient()
                .map(patient -> ResponseEntity.ok(billingService.getBillingsByPatientId(patient.getId())))
                .orElse(ResponseEntity.notFound().build());
    }
}

