import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { MedicineI } from '../models/medicine.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class MedicineService {
  private baseUrl = `${environment.apiUrl}/api/medicine/public`;
  private medicineSubject = new BehaviorSubject<MedicineI[]>([]);
  public medicine$ = this.medicineSubject.asObservable();

  constructor(private http: HttpClient) {}

  getAll(): Observable<MedicineI[]> {
    return this.http.get<MedicineI[]>(this.baseUrl);
  }

  getById(id: number): Observable<MedicineI> {
    return this.http.get<MedicineI>(`${this.baseUrl}/${id}`);
  }

  create(data: MedicineI): Observable<MedicineI> {
    return this.http.post<MedicineI>(this.baseUrl, data);
  }

  update(id: number, data: MedicineI): Observable<MedicineI> {
    return this.http.put<MedicineI>(`${this.baseUrl}/${id}`, data);
  }

  updateLocal(items: MedicineI[]): void {
    this.medicineSubject.next(items);
  }

  refresh(): void {
    this.getAll().subscribe(i => this.medicineSubject.next(i));
  }
}
