import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, map } from 'rxjs';
import { PatientI } from '../models/patient.model';
import { AuthService } from './auth.service';


@Injectable({
    providedIn: 'root'
})
export class PatientService {
    private baseUrl = 'http://localhost:3000/api/patient/public';
    private patientSubject = new BehaviorSubject<PatientI[]>([]);
    public patient$ = this.patientSubject.asObservable();

    constructor(
        private http: HttpClient,
        private authService: AuthService
    ) { }


    private getHeaders(): HttpHeaders {
        let headers = new HttpHeaders();
        const token = this.authService.getToken();
        if (token) {
            headers = headers.set('Authorization', `Bearer ${token}`);
        }
        return headers;
    }


    getAllPatients(): Observable<PatientI[]> {
        return this.http.get<{ patients: PatientI[] }>(this.baseUrl, {
            headers: this.getHeaders()
        }).pipe(
            map(response => response.patients) // extrae la lista correctamente
        );
    }




    // Método para actualizar el estado local de clientes
    updateLocalPatients(patient: PatientI[]): void {
        this.patientSubject.next(patient);
    }

    refreshPatients(): void {
        this.getAllPatients().subscribe(patient => {
            this.patientSubject.next(patient);
        });
    }


    createPatient(patientData: PatientI): Observable<PatientI> {
        return this.http.post<PatientI>(this.baseUrl, patientData, {
            headers: this.getHeaders()
        });
    }

    // En tu patient.service.ts
    updatePatient(id: number, patient: PatientI): Observable<PatientI> {
        return this.http.put<PatientI>(`${this.baseUrl}/${id}`, patient);
    }

    // Obtener paciente por ID
    getPatientById(id: number): Observable<PatientI> {
        return this.http.get<PatientI>(`${this.baseUrl}/${id}`, {
            headers: this.getHeaders()
        });
    }
}