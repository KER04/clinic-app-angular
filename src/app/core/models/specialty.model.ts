export interface SpecialtyI {
  id?: number;
  specialty_name: string;
  description?: string;
  status: "ACTIVE" | "INACTIVE";
}