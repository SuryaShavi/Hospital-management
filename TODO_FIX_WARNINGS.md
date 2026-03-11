# TODO - Fix All Warnings in Hospital Management Project

## Frontend Fixes

### 1. Fix frontend/package.json ✅ COMPLETE
- [x] Change package name from `@figma/my-make-file` to `hospital-management-frontend`
- [x] Remove `optional: true` from peerDependencies for react and react-dom
- [x] Remove pnpm section since using npm
- [x] Move react and react-dom to dependencies

## Backend Controller Fixes

### 2. Fix DoctorController.java ✅ COMPLETE
- [x] Add import for jakarta.validation.Valid
- [x] Add @Valid annotation to createDoctor method
- [x] Add @Valid annotation to updateDoctor method

### 3. Fix AppointmentController.java ✅ COMPLETE
- [x] Add import for jakarta.validation.Valid
- [x] Add @Valid annotation to createAppointment method
- [x] Add @Valid annotation to updateAppointment method

### 4. Fix BillingController.java ✅ COMPLETE
- [x] Add import for jakarta.validation.Valid
- [x] Add @Valid annotation to createBilling method
- [x] Add @Valid annotation to updateBilling method

### 5. Fix MedicalRecordController.java ✅ COMPLETE
- [x] Add import for jakarta.validation.Valid
- [x] Add @Valid annotation to createMedicalRecord method
- [x] Add @Valid annotation to updateMedicalRecord method

### 6. Fix PharmacyController.java ✅ COMPLETE
- [x] Add import for jakarta.validation.Valid
- [x] Add @Valid annotation to createMedication method
- [x] Add @Valid annotation to updateMedication method

### 7. Fix PatientController.java ✅ COMPLETE
- [x] Add @Valid annotation to updatePatient method

## Backend Security Fixes

### 8. Fix application.properties ✅ COMPLETE
- [x] JWT secret already uses environment variable with fallback
- [x] Change database username to use environment variable with fallback (`${DB_USERNAME:root}`)
- [x] Change database password to use environment variable with fallback (`${DB_PASSWORD:...}`)

## Build Verification

### Backend Build ✅ SUCCESS
```
mvn clean compile - BUILD SUCCESS
```

### Frontend Build ✅ SUCCESS
```
npm run build - ✓ built in 6.80s
```

## Summary

All warnings and errors have been fixed:
1. Frontend package.json - Fixed package name and peer dependencies
2. All Controllers - Added @Valid annotations for proper request body validation
3. application.properties - Using environment variables with fallbacks for sensitive data
4. Both backend and frontend build successfully without errors

