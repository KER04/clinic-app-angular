import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { PrescriptionI } from '../models/prescription.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PrescriptionService {
  private baseUrl = `${environment.apiUrl}/api/prescriptions/public`;
  private prescriptionSubject = new BehaviorSubject<PrescriptionI[]>([]);
  public prescription$ = this.prescriptionSubject.asObservable();

  constructor(private http: HttpClient) {}

  getAll(): Observable<PrescriptionI[]> {
    return this.http.get<PrescriptionI[]>(this.baseUrl);
  }

  getById(id: number): Observable<PrescriptionI> {
    return this.http.get<PrescriptionI>(`${this.baseUrl}/${id}`);
  }

  create(data: PrescriptionI): Observable<PrescriptionI> {
    return this.http.post<PrescriptionI>(this.baseUrl, data);
  }

  update(id: number, data: PrescriptionI): Observable<PrescriptionI> {
    return this.http.put<PrescriptionI>(`${this.baseUrl}/${id}`, data);
  }

  updateLocal(items: PrescriptionI[]): void {
    this.prescriptionSubject.next(items);
  }

  refresh(): void {
    this.getAll().subscribe(i => this.prescriptionSubject.next(i));
  }
}
