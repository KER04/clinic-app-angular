import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, map } from 'rxjs';
import { SpecialtyI } from '../models/specialty.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class specialtyService {
  private baseUrl = `${environment.apiUrl}/api/specialty/public`;
  private specialtySubject = new BehaviorSubject<SpecialtyI[]>([]);
  public specialty$ = this.specialtySubject.asObservable();

  constructor(private http: HttpClient) {}

  getAllSpecialty(): Observable<SpecialtyI[]> {
    return this.http.get<any>(this.baseUrl).pipe(
      map(resp => resp?.data ?? resp?.specialties ?? (Array.isArray(resp) ? resp : []))
    );
  }

  getSpecialtyById(id: string): Observable<SpecialtyI> {
    return this.http.get<SpecialtyI>(`${this.baseUrl}/${id}`);
  }

  createSpecialty(specialtyData: SpecialtyI): Observable<SpecialtyI> {
    return this.http.post<SpecialtyI>(this.baseUrl, specialtyData);
  }

  updateSpecialty(id: string, specialtyData: SpecialtyI): Observable<SpecialtyI> {
    return this.http.put<SpecialtyI>(`${this.baseUrl}/${id}`, specialtyData);
  }

  updateLocalSpecialty(specialty: SpecialtyI[]): void {
    this.specialtySubject.next(specialty);
  }

  refreshSpecialty(): void {
    this.getAllSpecialty().subscribe(specialty => {
      this.specialtySubject.next(specialty);
    });
  }
}
