// Backend API base URL
const API_BASE_URL = 'http://localhost:8080/api';
const AUTH_API_URL = 'http://localhost:8080/api/auth';

// ============== Auth Types ==============
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role: 'ADMIN' | 'DOCTOR' | 'NURSE' | 'RECEPTIONIST' | 'PATIENT';
}

export interface AuthResponse {
  token: string;
  id: number;
  name: string;
  email: string;
  role: string;
}

// ============== Role Types ==============
export type UserRole = 'ADMIN' | 'DOCTOR' | 'NURSE' | 'RECEPTIONIST' | 'PATIENT';

// Role-based page access permissions
export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  ADMIN: ['dashboard', 'patients', 'doctors', 'appointments', 'medical-records', 'billing', 'pharmacy', 'reports', 'settings'],
  DOCTOR: ['dashboard', 'patients', 'appointments', 'medical-records', 'pharmacy', 'billing'],
  NURSE: ['dashboard', 'patients', 'appointments', 'pharmacy'],
  RECEPTIONIST: ['dashboard', 'appointments', 'billing'],
  PATIENT: ['dashboard', 'appointments', 'medical-records', 'billing'],
};

// Check if user has permission to access a specific route
export const hasPermission = (role: UserRole | undefined, route: string): boolean => {
  if (!role) return false;
  return ROLE_PERMISSIONS[role]?.includes(route) ?? false;
};

// Get allowed routes for a user role
export const getAllowedRoutes = (role: UserRole | undefined): string[] => {
  if (!role) return [];
  return ROLE_PERMISSIONS[role] ?? [];
};

// Store auth data in localStorage
const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

export const authApi = {
  login: async (credentials: LoginRequest): Promise<{ data?: AuthResponse; error?: string }> => {
    try {
      const response = await fetch(`${AUTH_API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
      }
      const data: AuthResponse = await response.json();
      localStorage.setItem(TOKEN_KEY, data.token);
      localStorage.setItem(USER_KEY, JSON.stringify(data));
      return { data };
    } catch (error) {
      console.error('Login error:', error);
      return { error: error instanceof Error ? error.message : 'Login failed' };
    }
  },

  register: async (userData: RegisterRequest): Promise<{ data?: AuthResponse; error?: string }> => {
    try {
      const response = await fetch(`${AUTH_API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Registration failed');
      }
      const data: AuthResponse = await response.json();
      localStorage.setItem(TOKEN_KEY, data.token);
      localStorage.setItem(USER_KEY, JSON.stringify(data));
      return { data };
    } catch (error) {
      console.error('Registration error:', error);
      return { error: error instanceof Error ? error.message : 'Registration failed' };
    }
  },

  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  getToken: (): string | null => {
    return localStorage.getItem(TOKEN_KEY);
  },

  getUser: (): AuthResponse | null => {
    const userStr = localStorage.getItem(USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem(TOKEN_KEY);
  },
};

// Helper function to get auth headers
const getAuthHeaders = (): HeadersInit => {
  const token = authApi.getToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

// Handle API response errors including 403 Forbidden
const handleResponse = async <T>(response: Response): Promise<{ data?: T; error?: string }> => {
  if (response.status === 403) {
    return { error: 'Access denied. You do not have permission to perform this action.' };
  }
  if (response.status === 401) {
    // Token expired or invalid - clear auth and redirect to login
    authApi.logout();
    window.location.href = '/login';
    return { error: 'Session expired. Please login again.' };
  }
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    return { error: error.message || `HTTP error! status: ${response.status}` };
  }
  const data = await response.json();
  return { data };
};

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
    const response = await fetch(`${API_BASE_URL}/patients`, {
      headers: getAuthHeaders(),
    });
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
      headers: getAuthHeaders(),
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
      headers: getAuthHeaders(),
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
    const response = await fetch(`${API_BASE_URL}/patients/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
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
    const response = await fetch(`${API_BASE_URL}/doctors`, {
      headers: getAuthHeaders(),
    });
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
      headers: getAuthHeaders(),
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
      headers: getAuthHeaders(),
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
    const response = await fetch(`${API_BASE_URL}/doctors/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
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
    const response = await fetch(`${API_BASE_URL}/appointments`, {
      headers: getAuthHeaders(),
    });
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
      headers: getAuthHeaders(),
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
      headers: getAuthHeaders(),
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
    const response = await fetch(`${API_BASE_URL}/appointments/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
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
    const response = await fetch(`${API_BASE_URL}/billings`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    return { data };
  } catch (error) {
    console.error('Error fetching billings:', error);
    return { error: error instanceof Error ? error.message : 'Failed to fetch billings' };
  }
}

export async function getBillingById(id: number): Promise<ApiResponse<Billing>> {
  try {
    const response = await fetch(`${API_BASE_URL}/billings/${id}`, {
      headers: getAuthHeaders(),
    });
    return await handleResponse<Billing>(response);
  } catch (error) {
    console.error('Error fetching billing by ID:', error);
    return { error: error instanceof Error ? error.message : 'Failed to fetch billing' };
  }
}

export async function createBilling(billing: Omit<Billing, 'id'>): Promise<ApiResponse<Billing>> {
  try {
    const response = await fetch(`${API_BASE_URL}/billings`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(billing),
    });
    return await handleResponse<Billing>(response);
  } catch (error) {
    console.error('Error creating billing:', error);
    return { error: error instanceof Error ? error.message : 'Failed to create billing' };
  }
}

export async function updateBilling(id: number, billing: Billing): Promise<ApiResponse<Billing>> {
  try {
    const response = await fetch(`${API_BASE_URL}/billings/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(billing),
    });
    return await handleResponse<Billing>(response);
  } catch (error) {
    console.error('Error updating billing:', error);
    return { error: error instanceof Error ? error.message : 'Failed to update billing' };
  }
}

export async function deleteBilling(id: number): Promise<ApiResponse<void>> {
  try {
    const response = await fetch(`${API_BASE_URL}/billings/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return await handleResponse<void>(response);
  } catch (error) {
    console.error('Error deleting billing:', error);
    return { error: error instanceof Error ? error.message : 'Failed to delete billing' };
  }
}

// ============== Pharmacy API ==============
export async function getAllMedications(): Promise<ApiResponse<Pharmacy[]>> {
  try {
    const response = await fetch(`${API_BASE_URL}/pharmacy`, {
      headers: getAuthHeaders(),
    });
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
      headers: getAuthHeaders(),
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
      headers: getAuthHeaders(),
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
    const response = await fetch(`${API_BASE_URL}/pharmacy/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
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
    const response = await fetch(`${API_BASE_URL}/medical-records`, {
      headers: getAuthHeaders(),
    });
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
      headers: getAuthHeaders(),
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
      headers: getAuthHeaders(),
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
    const response = await fetch(`${API_BASE_URL}/medical-records/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return { data: undefined };
  } catch (error) {
    console.error('Error deleting medical record:', error);
    return { error: error instanceof Error ? error.message : 'Failed to delete medical record' };
  }
}

// ============== Role-Based API Calls ==============

// Get current logged-in user's profile based on role
export async function getMyProfile(): Promise<ApiResponse<Doctor | Patient>> {
  try {
    const user = authApi.getUser();
    if (!user) {
      return { error: 'User not authenticated' };
    }

    let url = '';
    if (user.role === 'DOCTOR') {
      url = `${API_BASE_URL}/doctors/me`;
    } else if (user.role === 'PATIENT') {
      url = `${API_BASE_URL}/patients/me`;
    } else {
      return { error: 'Invalid role for profile access' };
    }

    const response = await fetch(url, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    return { data };
  } catch (error) {
    console.error('Error fetching profile:', error);
    return { error: error instanceof Error ? error.message : 'Failed to fetch profile' };
  }
}

// Get patients for current doctor
export async function getMyPatients(): Promise<ApiResponse<Patient[]>> {
  try {
    const response = await fetch(`${API_BASE_URL}/doctors/my-patients`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    return { data };
  } catch (error) {
    console.error('Error fetching patients:', error);
    return { error: error instanceof Error ? error.message : 'Failed to fetch patients' };
  }
}

// Get appointments for current user (doctor or patient)
export async function getMyAppointments(): Promise<ApiResponse<Appointment[]>> {
  try {
    const response = await fetch(`${API_BASE_URL}/appointments/my-appointments`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    return { data };
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return { error: error instanceof Error ? error.message : 'Failed to fetch appointments' };
  }
}

// Get medical records for current patient
export async function getMyMedicalRecords(): Promise<ApiResponse<MedicalRecord[]>> {
  try {
    const response = await fetch(`${API_BASE_URL}/medical-records/my-records`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    return { data };
  } catch (error) {
    console.error('Error fetching medical records:', error);
    return { error: error instanceof Error ? error.message : 'Failed to fetch medical records' };
  }
}

// Get billing records for current user (patient or doctor)
export async function getMyBillings(): Promise<ApiResponse<Billing[]>> {
  try {
    const response = await fetch(`${API_BASE_URL}/billings/my-billings`, {
      headers: getAuthHeaders(),
    });
    return await handleResponse<Billing[]>(response);
  } catch (error) {
    console.error('Error fetching billings:', error);
    return { error: error instanceof Error ? error.message : 'Failed to fetch billings' };
  }
}

// Dashboard stats interface
export interface DashboardStats {
  totalPatients?: number;
  doctorsAvailable?: number;
  todayAppointments?: number;
  pendingReports?: number;
  myAppointments?: number;
  myPatients?: number;
  myRecords?: number;
  myBillings?: number;
}

// Get dashboard stats based on user role
export async function getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
  try {
    const user = authApi.getUser();
    if (!user) {
      return { error: 'User not authenticated' };
    }

    const stats: DashboardStats = {};

    // Fetch all counts in parallel
    const [patientsRes, doctorsRes, appointmentsRes] = await Promise.all([
      fetch(`${API_BASE_URL}/patients`, { headers: getAuthHeaders() }),
      fetch(`${API_BASE_URL}/doctors`, { headers: getAuthHeaders() }),
      fetch(`${API_BASE_URL}/appointments`, { headers: getAuthHeaders() })
    ]);

    const patients = patientsRes.ok ? await patientsRes.json() : [];
    const doctors = doctorsRes.ok ? await doctorsRes.json() : [];
    const appointments = appointmentsRes.ok ? await appointmentsRes.json() : [];

    // Common stats for all
    stats.doctorsAvailable = doctors.length;

    if (user.role === 'ADMIN') {
      stats.totalPatients = patients.length;
      stats.todayAppointments = appointments.length;
    } else if (user.role === 'DOCTOR') {
      // Get doctor's profile
      const doctorRes = await fetch(`${API_BASE_URL}/doctors/me`, { headers: getAuthHeaders() });
      if (doctorRes.ok) {
        const doctor = await doctorRes.json();
        // Count patients assigned to this doctor
        stats.myPatients = patients.filter((p: Patient) => p.doctor === String(doctor.id)).length;
      }
      // Get doctor's appointments
      stats.myAppointments = appointments.length;
    } else if (user.role === 'PATIENT') {
      // Get patient's profile
      const patientRes = await fetch(`${API_BASE_URL}/patients/me`, { headers: getAuthHeaders() });
      if (patientRes.ok) {
        const patient = await patientRes.json();
        // Count patient's appointments
        stats.myAppointments = appointments.filter((a: Appointment) => 
          a.patientName === patient.name
        ).length;
      }
    }

    return { data: stats };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return { error: error instanceof Error ? error.message : 'Failed to fetch dashboard stats' };
  }
}

