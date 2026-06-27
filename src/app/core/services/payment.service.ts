import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, map } from 'rxjs';
import { PaymentI } from '../models/payment.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private baseUrl = `${environment.apiUrl}/api/payment/public`;
  private paymentSubject = new BehaviorSubject<PaymentI[]>([]);
  public payment$ = this.paymentSubject.asObservable();

  constructor(private http: HttpClient) {}

  getAll(): Observable<PaymentI[]> {
    return this.http.get<any>(this.baseUrl).pipe(
      map(resp => resp?.data ?? (Array.isArray(resp) ? resp : []))
    );
  }

  getById(id: number): Observable<PaymentI> {
    return this.http.get<PaymentI>(`${this.baseUrl}/${id}`);
  }

  create(data: PaymentI): Observable<PaymentI> {
    return this.http.post<PaymentI>(this.baseUrl, data);
  }

  update(id: number, data: PaymentI): Observable<PaymentI> {
    return this.http.put<PaymentI>(`${this.baseUrl}/${id}`, data);
  }

  updateLocal(items: PaymentI[]): void {
    this.paymentSubject.next(items);
  }

  refresh(): void {
    this.getAll().subscribe(i => this.paymentSubject.next(i));
  }
}
