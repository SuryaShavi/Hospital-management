package com.hospital.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import java.time.LocalDate;

@Entity
public class MedicalRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String patientName;
    private String patientId;
    private String recordType;
    private String category;
    private LocalDate date;
    private String doctor;
    private String status;

    // Constructors
    public MedicalRecord() {}

    public MedicalRecord(String patientName, String patientId, String recordType, String category, LocalDate date, String doctor, String status) {
        this.patientName = patientName;
        this.patientId = patientId;
        this.recordType = recordType;
        this.category = category;
        this.date = date;
        this.doctor = doctor;
        this.status = status;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getPatientName() { return patientName; }
    public void setPatientName(String patientName) { this.patientName = patientName; }
    public String getPatientId() { return patientId; }
    public void setPatientId(String patientId) { this.patientId = patientId; }
    public String getRecordType() { return recordType; }
    public void setRecordType(String recordType) { this.recordType = recordType; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }
    public String getDoctor() { return doctor; }
    public void setDoctor(String doctor) { this.doctor = doctor; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}

