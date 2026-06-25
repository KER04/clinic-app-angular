export interface PatientI {
  id?: number;
  first_name: string;
  last_name: string;
  document: string;
  birth_date: Date;
  phone?: string;
  email?: string;
  address?: string;
  gender: "M" | "F";
  status: "ACTIVE" | "INACTIVE";
}


