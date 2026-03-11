package com.hospital.service;

import com.hospital.model.Doctor;
import com.hospital.model.Patient;
import com.hospital.model.Role;
import com.hospital.model.User;
import com.hospital.repository.DoctorRepository;
import com.hospital.repository.PatientRepository;
import com.hospital.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserContextService {

    private final UserRepository userRepository;
    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;

    /**
     * Get the currently authenticated user from JWT token
     */
    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new IllegalStateException("No authenticated user found");
        }
        
        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalStateException("User not found: " + email));
    }

    /**
     * Get the email of the currently authenticated user
     */
    public String getCurrentUserEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication.getName();
    }

    /**
     * Get the role of the currently authenticated user
     */
    public Role getCurrentUserRole() {
        return getCurrentUser().getRole();
    }

    /**
     * Get the ID of the currently authenticated user
     */
    public Long getCurrentUserId() {
        return getCurrentUser().getId();
    }

    /**
     * Get the Doctor profile of the currently authenticated user
     * Returns empty if user is not a DOCTOR
     */
    public Optional<Doctor> getCurrentDoctor() {
        User user = getCurrentUser();
        if (user.getRole() != Role.DOCTOR) {
            return Optional.empty();
        }
        return doctorRepository.findByUser(user);
    }

    /**
     * Get the Patient profile of the currently authenticated user
     * Returns empty if user is not a PATIENT
     */
    public Optional<Patient> getCurrentPatient() {
        User user = getCurrentUser();
        if (user.getRole() != Role.PATIENT) {
            return Optional.empty();
        }
        return patientRepository.findByUser(user);
    }

    /**
     * Check if current user is an ADMIN
     */
    public boolean isAdmin() {
        return getCurrentUserRole() == Role.ADMIN;
    }

    /**
     * Check if current user is a DOCTOR
     */
    public boolean isDoctor() {
        return getCurrentUserRole() == Role.DOCTOR;
    }

    /**
     * Check if current user is a PATIENT
     */
    public boolean isPatient() {
        return getCurrentUserRole() == Role.PATIENT;
    }

    /**
     * Check if current user has a specific role
     */
    public boolean hasRole(Role role) {
        return getCurrentUserRole() == role;
    }
}

