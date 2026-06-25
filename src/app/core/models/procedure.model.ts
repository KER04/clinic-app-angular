export interface ProcedureI {
  id?: number;
  appointment_id: number;
  procedure_code: string;
  procedure_name: string;
  description?: string;
  cost: string;
  performed_date: string;
  status: 'ACTIVE' | 'INACTIVE';
}
