// Backend API base URL
const API_BASE_URL = 'http://localhost:8080/api';

// ============== Patient ==============
export interface Patient {
  id?: number;
  name: string;
  age: number;
  gender: string;
  contact: string;
  email?: string;
  address?: string;
  bloodType?: string;
  status: string;
  doctor?: string;
}

// ============== Doctor ==============
export interface Doctor {
  id?: number;
  name: string;
  specialization: string;
  department: string;
  contact: string;
  email: string;
  availability: string;
  patients: number;
}

// ============== Appointment ==============
export interface Appointment {
  id?: number;
  patientName: string;
  doctorName: string;
  date: string;
  time: string;
  type: string;
  status: string;
}

// ============== Billing ==============
export interface Billing {
  id?: number;
  patientName: string;
  patientId: string;
  treatment: string;
  amount: number;
  paymentStatus: string;
  date: string;
  method: string;
}

// ============== Pharmacy (Medication) ==============
export interface Pharmacy {
  id?: number;
  name: string;
  category: string;
  stock: number;
  price: number;
  expiryDate: string;
  status: string;
}

// ============== Medical Record ==============
export interface MedicalRecord {
  id?: number;
  patientName: string;
  patientId: string;
  recordType: string;
  category: string;
  date: string;
  doctor: string;
  status: string;
}

// API Response type
interface ApiResponse<T> {
  data?: T;
  error?: string;
}

// ============== Patient API ==============
export async function getAllPatients(): Promise<ApiResponse<Patient[]>> {
  try {
    const response = await fetch(`${API_BASE_URL}/patients`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    return { data };
  } catch (error) {
    console.error('Error fetching patients:', error);
    return { error: error instanceof Error ? error.message : 'Failed to fetch patients' };
  }
}

export async function createPatient(patient: Omit<Patient, 'id'>): Promise<ApiResponse<Patient>> {
  try {
    const response = await fetch(`${API_BASE_URL}/patients`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patient),
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    return { data };
  } catch (error) {
    console.error('Error creating patient:', error);
    return { error: error instanceof Error ? error.message : 'Failed to create patient' };
  }
}

export async function updatePatient(id: number, patient: Patient): Promise<ApiResponse<Patient>> {
  try {
    const response = await fetch(`${API_BASE_URL}/patients/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patient),
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    return { data };
  } catch (error) {
    console.error('Error updating patient:', error);
    return { error: error instanceof Error ? error.message : 'Failed to update patient' };
  }
}

export async function deletePatient(id: number): Promise<ApiResponse<void>> {
  try {
    const response = await fetch(`${API_BASE_URL}/patients/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return { data: undefined };
  } catch (error) {
    console.error('Error deleting patient:', error);
    return { error: error instanceof Error ? error.message : 'Failed to delete patient' };
  }
}

// ============== Doctor API ==============
export async function getAllDoctors(): Promise<ApiResponse<Doctor[]>> {
  try {
    const response = await fetch(`${API_BASE_URL}/doctors`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    return { data };
  } catch (error) {
    console.error('Error fetching doctors:', error);
    return { error: error instanceof Error ? error.message : 'Failed to fetch doctors' };
  }
}

export async function createDoctor(doctor: Omit<Doctor, 'id'>): Promise<ApiResponse<Doctor>> {
  try {
    const response = await fetch(`${API_BASE_URL}/doctors`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(doctor),
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    return { data };
  } catch (error) {
    console.error('Error creating doctor:', error);
    return { error: error instanceof Error ? error.message : 'Failed to create doctor' };
  }
}

export async function updateDoctor(id: number, doctor: Doctor): Promise<ApiResponse<Doctor>> {
  try {
    const response = await fetch(`${API_BASE_URL}/doctors/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(doctor),
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    return { data };
  } catch (error) {
    console.error('Error updating doctor:', error);
    return { error: error instanceof Error ? error.message : 'Failed to update doctor' };
  }
}

export async function deleteDoctor(id: number): Promise<ApiResponse<void>> {
  try {
    const response = await fetch(`${API_BASE_URL}/doctors/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return { data: undefined };
  } catch (error) {
    console.error('Error deleting doctor:', error);
    return { error: error instanceof Error ? error.message : 'Failed to delete doctor' };
  }
}

// ============== Appointment API ==============
export async function getAllAppointments(): Promise<ApiResponse<Appointment[]>> {
  try {
    const response = await fetch(`${API_BASE_URL}/appointments`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    return { data };
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return { error: error instanceof Error ? error.message : 'Failed to fetch appointments' };
  }
}

export async function createAppointment(appointment: Omit<Appointment, 'id'>): Promise<ApiResponse<Appointment>> {
  try {
    const response = await fetch(`${API_BASE_URL}/appointments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(appointment),
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    return { data };
  } catch (error) {
    console.error('Error creating appointment:', error);
    return { error: error instanceof Error ? error.message : 'Failed to create appointment' };
  }
}

export async function updateAppointment(id: number, appointment: Appointment): Promise<ApiResponse<Appointment>> {
  try {
    const response = await fetch(`${API_BASE_URL}/appointments/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(appointment),
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    return { data };
  } catch (error) {
    console.error('Error updating appointment:', error);
    return { error: error instanceof Error ? error.message : 'Failed to update appointment' };
  }
}

export async function deleteAppointment(id: number): Promise<ApiResponse<void>> {
  try {
    const response = await fetch(`${API_BASE_URL}/appointments/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return { data: undefined };
  } catch (error) {
    console.error('Error deleting appointment:', error);
    return { error: error instanceof Error ? error.message : 'Failed to delete appointment' };
  }
}

// ============== Billing API ==============
export async function getAllBillings(): Promise<ApiResponse<Billing[]>> {
  try {
    const response = await fetch(`${API_BASE_URL}/billings`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    return { data };
  } catch (error) {
    console.error('Error fetching billings:', error);
    return { error: error instanceof Error ? error.message : 'Failed to fetch billings' };
  }
}

export async function createBilling(billing: Omit<Billing, 'id'>): Promise<ApiResponse<Billing>> {
  try {
    const response = await fetch(`${API_BASE_URL}/billings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(billing),
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    return { data };
  } catch (error) {
    console.error('Error creating billing:', error);
    return { error: error instanceof Error ? error.message : 'Failed to create billing' };
  }
}

export async function updateBilling(id: number, billing: Billing): Promise<ApiResponse<Billing>> {
  try {
    const response = await fetch(`${API_BASE_URL}/billings/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(billing),
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    return { data };
  } catch (error) {
    console.error('Error updating billing:', error);
    return { error: error instanceof Error ? error.message : 'Failed to update billing' };
  }
}

export async function deleteBilling(id: number): Promise<ApiResponse<void>> {
  try {
    const response = await fetch(`${API_BASE_URL}/billings/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return { data: undefined };
  } catch (error) {
    console.error('Error deleting billing:', error);
    return { error: error instanceof Error ? error.message : 'Failed to delete billing' };
  }
}

// ============== Pharmacy API ==============
export async function getAllMedications(): Promise<ApiResponse<Pharmacy[]>> {
  try {
    const response = await fetch(`${API_BASE_URL}/pharmacy`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    return { data };
  } catch (error) {
    console.error('Error fetching medications:', error);
    return { error: error instanceof Error ? error.message : 'Failed to fetch medications' };
  }
}

export async function createMedication(pharmacy: Omit<Pharmacy, 'id'>): Promise<ApiResponse<Pharmacy>> {
  try {
    const response = await fetch(`${API_BASE_URL}/pharmacy`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pharmacy),
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    return { data };
  } catch (error) {
    console.error('Error creating medication:', error);
    return { error: error instanceof Error ? error.message : 'Failed to create medication' };
  }
}

export async function updateMedication(id: number, pharmacy: Pharmacy): Promise<ApiResponse<Pharmacy>> {
  try {
    const response = await fetch(`${API_BASE_URL}/pharmacy/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pharmacy),
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    return { data };
  } catch (error) {
    console.error('Error updating medication:', error);
    return { error: error instanceof Error ? error.message : 'Failed to update medication' };
  }
}

export async function deleteMedication(id: number): Promise<ApiResponse<void>> {
  try {
    const response = await fetch(`${API_BASE_URL}/pharmacy/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return { data: undefined };
  } catch (error) {
    console.error('Error deleting medication:', error);
    return { error: error instanceof Error ? error.message : 'Failed to delete medication' };
  }
}

// ============== Medical Record API ==============
export async function getAllMedicalRecords(): Promise<ApiResponse<MedicalRecord[]>> {
  try {
    const response = await fetch(`${API_BASE_URL}/medical-records`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    return { data };
  } catch (error) {
    console.error('Error fetching medical records:', error);
    return { error: error instanceof Error ? error.message : 'Failed to fetch medical records' };
  }
}

export async function createMedicalRecord(record: Omit<MedicalRecord, 'id'>): Promise<ApiResponse<MedicalRecord>> {
  try {
    const response = await fetch(`${API_BASE_URL}/medical-records`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(record),
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    return { data };
  } catch (error) {
    console.error('Error creating medical record:', error);
    return { error: error instanceof Error ? error.message : 'Failed to create medical record' };
  }
}

export async function updateMedicalRecord(id: number, record: MedicalRecord): Promise<ApiResponse<MedicalRecord>> {
  try {
    const response = await fetch(`${API_BASE_URL}/medical-records/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(record),
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    return { data };
  } catch (error) {
    console.error('Error updating medical record:', error);
    return { error: error instanceof Error ? error.message : 'Failed to update medical record' };
  }
}

export async function deleteMedicalRecord(id: number): Promise<ApiResponse<void>> {
  try {
    const response = await fetch(`${API_BASE_URL}/medical-records/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return { data: undefined };
  } catch (error) {
    console.error('Error deleting medical record:', error);
    return { error: error instanceof Error ? error.message : 'Failed to delete medical record' };
  }
}

