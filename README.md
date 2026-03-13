# Hospital Management System

Modern full-stack hospital management web application.

## 🏥 Overview

**Backend:** Spring Boot 3.2 + JPA + MySQL + JWT Security + Swagger API docs  
**Frontend:** React 18 + Vite + Tailwind CSS + shadcn/ui + React Router  
**Database:** MySQL `hospital_db`  
**Testing:** Jest  

Features: Patient/Doctor management, Appointments, Billing, Medical Records, Pharmacy, Reports, Authentication.

## 📋 Prerequisites

1. **Node.js** ≥18 (`npm`, `npx`)
2. **Maven** 3.8+ 
3. **MySQL** Server running:
   - Database: `hospital_db`
   - User: `root`
   - Password: `Suryas@1403@14` *(Change in backend/src/main/resources/application.properties for production)*
4. **Java JDK** 17+

## 🚀 Quick Start

### 1. Backend Setup & Run
```bash
cd backend
mvn clean install
mvn spring-boot:run
```
- Port: **http://localhost:8080**
- API Docs: http://localhost:8080/swagger-ui.html

### 2. Frontend Setup & Run
```bash
cd frontend
npm install
npm run dev
```
- Dev Server: **http://localhost:5173**
- Build: `npm run build`

### 3. Testing
```bash
cd testing
npm install
npm test
```

## 🔌 API Endpoints

Protected by JWT. Login/Register first.

- `/api/auth/login`, `/api/auth/register`
- `/api/patients`, `/api/doctors`, `/api/appointments`, `/api/billing`, etc.

## 🛠️ Development

**Backend:**
- Config: `backend/src/main/resources/application.properties`
- Models/Controllers/Services in `backend/src/main/java/com/hospital`

**Frontend:**
- Pages: `frontend/src/app/pages/*`
- API calls: `frontend/src/app/services/api.ts`
- UI Components: `frontend/src/app/components/ui/*`

## ⚙️ Environment Variables

Backend uses:
```
DB_USERNAME=root
DB_PASSWORD=Suryas@1403@14
JWT_SECRET=...
```

## 🐛 Troubleshooting

- **npm ENOENT:** No root package.json; use subfolder installs.
- **MySQL connection:** Verify DB/server, update creds.
- **CORS:** Backend allows frontend origins.
- **Ports busy:** Kill processes or change ports.

## 📱 Pages

- Dashboard, Patients, Doctors, Appointments, Medical Records, Billing, Pharmacy, Reports, Login/Register, Settings

See TODO.md for setup progress.

Built with ❤️ for efficient hospital operations.

