import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, map } from 'rxjs';
import { PatientI } from '../models/patient.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  private baseUrl = `${environment.apiUrl}/api/patient/public`;
  private patientSubject = new BehaviorSubject<PatientI[]>([]);
  public patient$ = this.patientSubject.asObservable();

  constructor(private http: HttpClient) {}

  getAllPatients(): Observable<PatientI[]> {
    return this.http.get<{ patients: PatientI[] }>(this.baseUrl).pipe(
      map(response => response.patients)
    );
  }

  getPatientById(id: number): Observable<PatientI> {
    return this.http.get<PatientI>(`${this.baseUrl}/${id}`);
  }

  createPatient(patientData: PatientI): Observable<PatientI> {
    return this.http.post<PatientI>(this.baseUrl, patientData);
  }

  updatePatient(id: number, patient: PatientI): Observable<PatientI> {
    return this.http.put<PatientI>(`${this.baseUrl}/${id}`, patient);
  }

  updateLocalPatients(patient: PatientI[]): void {
    this.patientSubject.next(patient);
  }

  refreshPatients(): void {
    this.getAllPatients().subscribe(patient => {
      this.patientSubject.next(patient);
    });
  }
}
