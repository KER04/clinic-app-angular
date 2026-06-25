import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { PrescriptionDetailI } from '../models/prescriptiondetail.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PrescriptionDetailService {
  private baseUrl = `${environment.apiUrl}/api/prescriptiondetail/public`;
  private detailSubject = new BehaviorSubject<PrescriptionDetailI[]>([]);
  public detail$ = this.detailSubject.asObservable();

  constructor(private http: HttpClient) {}

  getAll(): Observable<PrescriptionDetailI[]> {
    return this.http.get<PrescriptionDetailI[]>(this.baseUrl);
  }

  getById(id: number): Observable<PrescriptionDetailI> {
    return this.http.get<PrescriptionDetailI>(`${this.baseUrl}/${id}`);
  }

  create(data: PrescriptionDetailI): Observable<PrescriptionDetailI> {
    return this.http.post<PrescriptionDetailI>(this.baseUrl, data);
  }

  update(id: number, data: PrescriptionDetailI): Observable<PrescriptionDetailI> {
    return this.http.put<PrescriptionDetailI>(`${this.baseUrl}/${id}`, data);
  }

  updateLocal(items: PrescriptionDetailI[]): void {
    this.detailSubject.next(items);
  }

  refresh(): void {
    this.getAll().subscribe(i => this.detailSubject.next(i));
  }
}
