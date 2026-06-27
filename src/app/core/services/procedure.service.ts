import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, map } from 'rxjs';
import { ProcedureI } from '../models/procedure.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ProcedureService {
  private baseUrl = `${environment.apiUrl}/api/procedure/public`;
  private procedureSubject = new BehaviorSubject<ProcedureI[]>([]);
  public procedure$ = this.procedureSubject.asObservable();

  constructor(private http: HttpClient) {}

  getAll(): Observable<ProcedureI[]> {
    return this.http.get<any>(this.baseUrl).pipe(
      map(resp => resp?.data ?? (Array.isArray(resp) ? resp : []))
    );
  }

  getById(id: number): Observable<ProcedureI> {
    return this.http.get<ProcedureI>(`${this.baseUrl}/${id}`);
  }

  create(data: ProcedureI): Observable<ProcedureI> {
    return this.http.post<ProcedureI>(this.baseUrl, data);
  }

  update(id: number, data: ProcedureI): Observable<ProcedureI> {
    return this.http.put<ProcedureI>(`${this.baseUrl}/${id}`, data);
  }

  updateLocal(items: ProcedureI[]): void {
    this.procedureSubject.next(items);
  }

  refresh(): void {
    this.getAll().subscribe(i => this.procedureSubject.next(i));
  }
}
