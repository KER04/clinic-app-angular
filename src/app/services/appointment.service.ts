import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, map } from 'rxjs';
import { AppointmentI } from '../models/appointment.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  private baseUrl = 'http://localhost:3000/api/appointment/public';
  private appointmentSubject = new BehaviorSubject<AppointmentI[]>([]);
  public appointment$ = this.appointmentSubject.asObservable();

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  // Headers con token
  private getHeaders(): HttpHeaders {
    let headers = new HttpHeaders();
    const token = this.authService.getToken();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  // Obtener TODAS las citas
  getAllAppointments(): Observable<AppointmentI[]> {
    return this.http.get<any>(this.baseUrl, {
      headers: this.getHeaders()
    }).pipe(
      map(resp => {
        console.log("API response:", resp);

        // NORMALIZACIÓN
        if (resp && Array.isArray(resp.appointment)) {
          return resp.appointment;
        }

        if (resp && Array.isArray(resp.appointments)) {
          return resp.appointments;
        }

        if (Array.isArray(resp)) {
          return resp;
        }

        return [];
      })
    );
  }

  // Obtener cita por ID
  getAppointmentById(id: string): Observable<AppointmentI> {
    return this.http.get<AppointmentI>(`${this.baseUrl}/${id}`, {
      headers: this.getHeaders()
    });
  }

  // Crear nueva cita
  createAppointment(appointment: AppointmentI): Observable<AppointmentI> {
    return this.http.post<AppointmentI>(this.baseUrl, appointment, {
      headers: this.getHeaders()
    });
  }

  // Actualizar cita
  updateAppointment(id: string, appointment: AppointmentI): Observable<AppointmentI> {
    return this.http.put<AppointmentI>(`${this.baseUrl}/${id}`, appointment, {
      headers: this.getHeaders()
    });
  }

  // Actualizar lista local
  updateLocalAppointments(appointments: AppointmentI[]): void {
    this.appointmentSubject.next(appointments);
  }

  // Refrescar lista de citas
  refreshAppointments(): void {
    this.getAllAppointments().subscribe(apps => {
      this.appointmentSubject.next(apps);
    });
  }
}
