export interface DoctorI {
  id?: number;
  first_name: string;
  last_name: string;
  document: string;
  phone?: string;
  email?: string;
  medical_license: string;
  specialty_id: number;
  status: "ACTIVE" | "INACTIVE"; // ⚠️ Corregido: era "ACTIVE | INACTIVE" (sin comillas internas)
}