export interface PaymentI {
  id?: number;
  appointment_id: number;
  total_amount: string;
  consultation_amount: string;
  procedures_amount: string;
  payment_method: string;
  payment_date: string;
  payment_status: 'PENDIENTE' | 'PAGADO' | 'CANCELADO';
  invoice_number?: string;
  status: 'ACTIVE' | 'INACTIVE';
}
