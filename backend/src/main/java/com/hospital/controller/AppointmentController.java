package com.hospital.controller;

import com.hospital.model.Appointment;
import com.hospital.service.AppointmentService;
import com.hospital.service.UserContextService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;

    @Autowired
    private UserContextService userContextService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'RECEPTIONIST')")
    public List<Appointment> getAllAppointments() {
        return appointmentService.getAllAppointments();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'RECEPTIONIST')")
    public ResponseEntity<Appointment> getAppointmentById(@PathVariable Long id) {
        return appointmentService.getAppointmentById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'RECEPTIONIST')")
    public Appointment createAppointment(@Valid @RequestBody Appointment appointment) {
        return appointmentService.saveAppointment(appointment);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'RECEPTIONIST')")
    public ResponseEntity<Appointment> updateAppointment(@PathVariable Long id, @Valid @RequestBody Appointment appointment) {
        return appointmentService.getAppointmentById(id)
                .map(existingAppointment -> {
                    appointment.setId(id);
                    return ResponseEntity.ok(appointmentService.saveAppointment(appointment));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR')")
    public ResponseEntity<Void> deleteAppointment(@PathVariable Long id) {
        if (appointmentService.getAppointmentById(id).isPresent()) {
            appointmentService.deleteAppointment(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    // ========== Role-based endpoints for logged-in users ==========

    /**
     * Get appointments for the current logged-in user (doctor or patient)
     * GET /api/appointments/my-appointments
     */
    @GetMapping("/my-appointments")
    @PreAuthorize("hasAnyRole('DOCTOR', 'PATIENT')")
    public ResponseEntity<List<Appointment>> getMyAppointments() {
        if (userContextService.isDoctor()) {
            return userContextService.getCurrentDoctor()
                    .map(doctor -> ResponseEntity.ok(appointmentService.getAppointmentsByDoctorId(doctor.getId())))
                    .orElse(ResponseEntity.notFound().build());
        } else if (userContextService.isPatient()) {
            return userContextService.getCurrentPatient()
                    .map(patient -> ResponseEntity.ok(appointmentService.getAppointmentsByPatientId(patient.getId())))
                    .orElse(ResponseEntity.notFound().build());
        }
        return ResponseEntity.ok().build();
    }
}

