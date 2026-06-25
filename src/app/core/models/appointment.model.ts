// appointment.model.ts
export interface PatientInfo {
  id: number;
  first_name: string;
  last_name: string;
  document: string;
  phone?: string;
  email?: string;
}

export interface DoctorInfo {
  id: number;
  first_name: string;
  last_name: string;
  medical_license: string;
  specialty_id?: number;
}

export interface AppointmentI {
  id?: number;
  patient_id: number;
  doctor_id: number;
  appointment_datetime: Date | string; // Puede venir como string del backend
  consultation_reason?: string;
  status: "ACTIVE" | "INACTIVE";
  observations?: string;
  
  // Relaciones
  patient?: PatientInfo;
  doctor?: DoctorInfo;
}