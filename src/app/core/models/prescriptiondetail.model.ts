export interface PrescriptionDetailI {
  id?: number;
  prescription_id: number;
  medicine_id: number;
  quantity: number;
  dosage: string;
  treatment_days: number;
  special_instructions?: string;
  status: 'ACTIVE' | 'INACTIVE';
}
