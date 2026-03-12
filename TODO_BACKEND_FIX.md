# Backend Fix TODOs (Completed)

## Plan Implementation Steps

- [x] 1. Update Patient.java: Change doctor from String to @ManyToOne Doctor
- [x] 2. Update Repositories:
  - [x]   BillingRepository.java: Add findByPatientIn, findByPatientDoctorId
  - [x]   PatientRepository.java: Add findByDoctorId, findByDoctor
  - [x]   MedicalRecordRepository.java: Add findByPatientDoctorId
- [x] 3. Update Services:
  - [x]   DoctorService.java: Optimize getPatientsByDoctor
  - [x]   BillingService.java: Fix findByPatientIn call, optimize methods
  - [x]   MedicalRecordService.java: Optimize getMedicalRecordsByDoctorPatients
- [x] 4. Run mvn clean compile to verify no errors
- [ ] 5. Manual DB migration: ALTER TABLE patients ADD COLUMN doctor_id BIGINT REFERENCES doctors(id);

**All compilation errors fixed. Backend now compiles cleanly. DB schema update required for production.**

