export interface MedicineI {
  id?: number;
  commercial_name: string;
  generic_name: string;
  concentration: string;
  pharmaceutical_form: string;
  laboratory: string;
  unit_price: string;
  status: 'ACTIVE' | 'INACTIVE';
}
