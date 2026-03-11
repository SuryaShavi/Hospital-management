package com.hospital.service;

import com.hospital.model.Doctor;
import com.hospital.model.Patient;
import com.hospital.model.User;
import com.hospital.repository.DoctorRepository;
import com.hospital.repository.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DoctorService {

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private PatientRepository patientRepository;

    public List<Doctor> getAllDoctors() {
        return doctorRepository.findAll();
    }

    public Optional<Doctor> getDoctorById(@NonNull Long id) {
        return doctorRepository.findById(id);
    }

    public Optional<Doctor> getDoctorByUserId(Long userId) {
        return doctorRepository.findByUserId(userId);
    }

    public Optional<Doctor> getDoctorByUser(User user) {
        return doctorRepository.findByUser(user);
    }

    public Doctor saveDoctor(Doctor doctor) {
        return doctorRepository.save(doctor);
    }

    public void deleteDoctor(@NonNull Long id) {
        doctorRepository.deleteById(id);
    }

    /**
     * Get patients assigned to a specific doctor
     */
    public List<Patient> getPatientsByDoctor(Long doctorId) {
        return patientRepository.findAll().stream()
                .filter(p -> p.getDoctor() != null && p.getDoctor().equals(String.valueOf(doctorId)))
                .toList();
    }

    /**
     * Get all patients (for doctor's dashboard)
     */
    public List<Patient> getAllPatients() {
        return patientRepository.findAll();
    }
}

