export interface PrescriptionI {
  id?: number;
  appointment_id: number;
  doctor_id: number;
  issue_date: string;
  general_instructions?: string;
  status: 'ACTIVE' | 'INACTIVE';
}
