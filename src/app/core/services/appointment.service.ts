import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, map } from 'rxjs';
import { AppointmentI } from '../models/appointment.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  private baseUrl = `${environment.apiUrl}/api/appointment/public`;
  private appointmentSubject = new BehaviorSubject<AppointmentI[]>([]);
  public appointment$ = this.appointmentSubject.asObservable();

  constructor(private http: HttpClient) {}

  getAllAppointments(): Observable<AppointmentI[]> {
    return this.http.get<any>(this.baseUrl).pipe(
      map(resp => resp?.data ?? resp?.appointment ?? resp?.appointments ?? (Array.isArray(resp) ? resp : []))
    );
  }

  getAppointmentById(id: string): Observable<AppointmentI> {
    return this.http.get<AppointmentI>(`${this.baseUrl}/${id}`);
  }

  createAppointment(appointment: AppointmentI): Observable<AppointmentI> {
    return this.http.post<AppointmentI>(this.baseUrl, appointment);
  }

  updateAppointment(id: string, appointment: AppointmentI): Observable<AppointmentI> {
    return this.http.put<AppointmentI>(`${this.baseUrl}/${id}`, appointment);
  }

  updateLocalAppointments(appointments: AppointmentI[]): void {
    this.appointmentSubject.next(appointments);
  }

  refreshAppointments(): void {
    this.getAllAppointments().subscribe(apps => {
      this.appointmentSubject.next(apps);
    });
  }
}
