import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, map } from 'rxjs';
import { SpecialtyI } from '../models/specialty.model';
import { AuthService } from './auth.service';


@Injectable({
    providedIn: 'root'
})
export class specialtyService {

    private baseUrl = 'http://localhost:3000/api/specialty/public';
    private specialtySubject = new BehaviorSubject<SpecialtyI[]>([]);
    public specialty$ = this.specialtySubject.asObservable();


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

    getAllSpecialty(): Observable<SpecialtyI[]> {
        return this.http.get<{ specialties: SpecialtyI[] }>(this.baseUrl, {
            headers: this.getHeaders()
        }).pipe(
            map(response => response.specialties)
        );
    }

    // Método para actualizar el estado local de clientes
    updateLocalSpecialty(specialty: SpecialtyI[]): void {
        this.specialtySubject.next(specialty);
    }

    refreshSpecialty(): void {
        this.getAllSpecialty().subscribe(specialty => {
            this.specialtySubject.next(specialty);
        });
    }


    // Método para crear una nueva especialidad
    createSpecialty(specialtyData: SpecialtyI): Observable<SpecialtyI> {
        return this.http.post<SpecialtyI>(this.baseUrl, specialtyData, {
            headers: this.getHeaders()
        });
    }

    //metodo para actualizar una especialidad
    updateSpecialty(id: string, specialtyData: SpecialtyI): Observable<SpecialtyI> {
        const url = `${this.baseUrl}/${id}`;
        return this.http.put<SpecialtyI>(url, specialtyData, {
            headers: this.getHeaders()
        });
    }

    getSpecialtyById(id: string): Observable<SpecialtyI> {
    return this.http.get<SpecialtyI>(`${this.baseUrl}/${id}`, {
        headers: this.getHeaders()
    });
}

}
