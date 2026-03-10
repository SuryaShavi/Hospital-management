package com.hospital.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;

@Entity
public class Doctor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String specialization;
    private String department;
    private String contact;
    private String email;
    private String availability;
    private int patients;

    // Constructors
    public Doctor() {}

    public Doctor(String name, String specialization, String department, String contact, String email, String availability, int patients) {
        this.name = name;
        this.specialization = specialization;
        this.department = department;
        this.contact = contact;
        this.email = email;
        this.availability = availability;
        this.patients = patients;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getSpecialization() { return specialization; }
    public void setSpecialization(String specialization) { this.specialization = specialization; }
    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }
    public String getContact() { return contact; }
    public void setContact(String contact) { this.contact = contact; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getAvailability() { return availability; }
    public void setAvailability(String availability) { this.availability = availability; }
    public int getPatients() { return patients; }
    public void setPatients(int patients) { this.patients = patients; }
}

