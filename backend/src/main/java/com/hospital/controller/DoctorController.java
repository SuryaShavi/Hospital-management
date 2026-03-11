package com.hospital.controller;

import com.hospital.model.Appointment;
import com.hospital.model.Billing;
import com.hospital.model.Doctor;
import com.hospital.model.MedicalRecord;
import com.hospital.model.Patient;
import com.hospital.service.AppointmentService;
import com.hospital.service.BillingService;
import com.hospital.service.DoctorService;
import com.hospital.service.MedicalRecordService;
import com.hospital.service.UserContextService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/doctors")
public class DoctorController {

    @Autowired
    private DoctorService doctorService;

    @Autowired
    private UserContextService userContextService;

    @Autowired
    private AppointmentService appointmentService;

    @Autowired
    private MedicalRecordService medicalRecordService;

    @Autowired
    private BillingService billingService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR')")
    public List<Doctor> getAllDoctors() {
        return doctorService.getAllDoctors();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR')")
    public ResponseEntity<Doctor> getDoctorById(@PathVariable Long id) {
        return doctorService.getDoctorById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Doctor createDoctor(@Valid @RequestBody Doctor doctor) {
        return doctorService.saveDoctor(doctor);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Doctor> updateDoctor(@PathVariable Long id, @Valid @RequestBody Doctor doctor) {
        return doctorService.getDoctorById(id)
                .map(existingDoctor -> {
                    doctor.setId(id);
                    return ResponseEntity.ok(doctorService.saveDoctor(doctor));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteDoctor(@PathVariable Long id) {
        if (doctorService.getDoctorById(id).isPresent()) {
            doctorService.deleteDoctor(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    // ========== Role-based endpoints for logged-in doctor ==========

    /**
     * Get current logged-in doctor's profile
     * GET /api/doctors/me
     */
    @GetMapping("/me")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<Doctor> getMyProfile() {
        return userContextService.getCurrentDoctor()
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Get patients assigned to the current logged-in doctor
     * GET /api/doctors/my-patients
     */
    @GetMapping("/my-patients")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<List<Patient>> getMyPatients() {
        return userContextService.getCurrentDoctor()
                .map(doctor -> ResponseEntity.ok(doctorService.getPatientsByDoctor(doctor.getId())))
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Get appointments for the current logged-in doctor
     * GET /api/doctors/my-appointments
     */
    @GetMapping("/my-appointments")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<List<Appointment>> getMyAppointments() {
        return userContextService.getCurrentDoctor()
                .map(doctor -> ResponseEntity.ok(appointmentService.getAppointmentsByDoctorId(doctor.getId())))
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Get medical records for patients of the current logged-in doctor
     * GET /api/doctors/my-patients/medical-records
     */
    @GetMapping("/my-patients/medical-records")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<List<MedicalRecord>> getMyPatientsMedicalRecords() {
        return userContextService.getCurrentDoctor()
                .map(doctor -> ResponseEntity.ok(medicalRecordService.getMedicalRecordsByDoctorPatients(doctor.getId())))
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Get billing records for patients-in doctor
     of the current logged * GET /api/doctors/my-patients/billings
     */
    @GetMapping("/my-patients/billings")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<List<Billing>> getMyPatientsBillings() {
        return userContextService.getCurrentDoctor()
                .map(doctor -> ResponseEntity.ok(billingService.getBillingsByDoctorPatients(doctor.getId())))
                .orElse(ResponseEntity.notFound().build());
    }
}

