import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, map } from 'rxjs';
import { DoctorI } from '../models/doctor.model';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})

export class DoctorService {
    private baseUrl = 'http://localhost:3000/api/doctor/public';
    private doctorSubject = new BehaviorSubject<DoctorI[]>([]);
    public doctor$ = this.doctorSubject.asObservable();

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

    getAllDoctors(): Observable<DoctorI[]> {
    return this.http.get<DoctorI[] | { doctors: DoctorI[] }>(this.baseUrl, {
        headers: this.getHeaders()
    }).pipe(
        map(response => {
            // Si ya es un array, devuélvelo directamente
            if (Array.isArray(response)) {
                return response;
            }
            // Si es un objeto con la propiedad doctors, extráela
            return response.doctors || [];
        })
    );
}

    // Obtener doctor por ID
    getDoctorById(id: string): Observable<DoctorI> {
        return this.http.get<DoctorI>(`${this.baseUrl}/${id}`, {
            headers: this.getHeaders()
        });
    }

    // Crear doctor
    createDoctor(doctor: DoctorI): Observable<DoctorI> {
        return this.http.post<DoctorI>(this.baseUrl, doctor, {
            headers: this.getHeaders()
        });
    }

    // Actualizar doctor
    updateDoctor(id: string, doctor: DoctorI): Observable<DoctorI> {
        return this.http.put<DoctorI>(`${this.baseUrl}/${id}`, doctor, {
            headers: this.getHeaders()
        });
    }

    // Actualizar el estado local de doctores
    updateLocalDoctors(doctors: DoctorI[]): void {
        this.doctorSubject.next(doctors);
    }

    // Refrescar lista de doctores
    refreshDoctors(): void {
        this.getAllDoctors().subscribe(doctors => {
            this.doctorSubject.next(doctors);
        });
    }
}