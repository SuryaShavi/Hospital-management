// shared credentials used across e2e tests
export const CREDENTIALS: Record<string, { email: string; pass: string }> = {
  admin: {
    email: process.env.ADMIN_EMAIL || 'admin@example.com',
    pass: process.env.ADMIN_PASS || 'password',
  },
  doctor: {
    email: process.env.DOCTOR_EMAIL || 'doctor@example.com',
    pass: process.env.DOCTOR_PASS || 'password',
  },
  nurse: {
    email: process.env.NURSE_EMAIL || 'nurse@example.com',
    pass: process.env.NURSE_PASS || 'password',
  },
  patient: {
    email: process.env.PATIENT_EMAIL || 'patient@example.com',
    pass: process.env.PATIENT_PASS || 'password',
  },
};
