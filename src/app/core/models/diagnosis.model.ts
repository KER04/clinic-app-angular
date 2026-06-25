export interface DiagnosisI {
  id?: number;
  patient_id: number;
  appointment_id: number;
  icd10_code?: string;
  description: string;
  diagnosis_date: string;
  observations?: string;
  status: 'ACTIVE' | 'INACTIVE';
}
