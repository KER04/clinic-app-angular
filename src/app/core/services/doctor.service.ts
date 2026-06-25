import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, map } from 'rxjs';
import { DoctorI } from '../models/doctor.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {
  private baseUrl = `${environment.apiUrl}/api/doctor/public`;
  private doctorSubject = new BehaviorSubject<DoctorI[]>([]);
  public doctor$ = this.doctorSubject.asObservable();

  constructor(private http: HttpClient) {}

  getAllDoctors(): Observable<DoctorI[]> {
    return this.http.get<DoctorI[] | { doctors: DoctorI[] }>(this.baseUrl).pipe(
      map(response => {
        if (Array.isArray(response)) return response;
        return response.doctors || [];
      })
    );
  }

  getDoctorById(id: string): Observable<DoctorI> {
    return this.http.get<DoctorI>(`${this.baseUrl}/${id}`);
  }

  createDoctor(doctor: DoctorI): Observable<DoctorI> {
    return this.http.post<DoctorI>(this.baseUrl, doctor);
  }

  updateDoctor(id: string, doctor: DoctorI): Observable<DoctorI> {
    return this.http.put<DoctorI>(`${this.baseUrl}/${id}`, doctor);
  }

  updateLocalDoctors(doctors: DoctorI[]): void {
    this.doctorSubject.next(doctors);
  }

  refreshDoctors(): void {
    this.getAllDoctors().subscribe(doctors => {
      this.doctorSubject.next(doctors);
    });
  }
}
