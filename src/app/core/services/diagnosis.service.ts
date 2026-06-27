import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, map } from 'rxjs';
import { DiagnosisI } from '../models/diagnosis.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class DiagnosisService {
  private baseUrl = `${environment.apiUrl}/api/diagnosis/public`;
  private diagnosisSubject = new BehaviorSubject<DiagnosisI[]>([]);
  public diagnosis$ = this.diagnosisSubject.asObservable();

  constructor(private http: HttpClient) {}

  getAll(): Observable<DiagnosisI[]> {
    return this.http.get<any>(this.baseUrl).pipe(
      map(resp => resp?.data ?? resp?.diagnosis ?? (Array.isArray(resp) ? resp : []))
    );
  }

  getById(id: number): Observable<DiagnosisI> {
    return this.http.get<any>(`${this.baseUrl}/${id}`).pipe(
      map(resp => resp.diagnosis ?? resp)
    );
  }

  create(data: DiagnosisI): Observable<DiagnosisI> {
    return this.http.post<DiagnosisI>(this.baseUrl, data);
  }

  update(id: number, data: DiagnosisI): Observable<DiagnosisI> {
    return this.http.put<DiagnosisI>(`${this.baseUrl}/${id}`, data);
  }

  updateLocal(items: DiagnosisI[]): void {
    this.diagnosisSubject.next(items);
  }

  refresh(): void {
    this.getAll().subscribe(i => this.diagnosisSubject.next(i));
  }
}
