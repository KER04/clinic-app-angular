import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { PaymentI } from '../../../core/models/payment.model';
import { PaymentService } from '../../../core/services/payment.service';

@Component({
  selector: 'app-create-payment',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CardModule, InputTextModule, DatePickerModule, SelectModule, ButtonModule, ToastModule],
  templateUrl: './create-payment.html',
  styleUrl: './create-payment.css',
  providers: [MessageService]
})
export class CreatePayment implements OnInit {
  form!: FormGroup;
  loading = false;

  paymentMethodOptions = [
    { label: 'Efectivo', value: 'EFECTIVO' },
    { label: 'Tarjeta', value: 'TARJETA' },
    { label: 'Transferencia', value: 'TRANSFERENCIA' },
    { label: 'Cheque', value: 'CHEQUE' }
  ];

  paymentStatusOptions = [
    { label: 'Pendiente', value: 'PENDIENTE' },
    { label: 'Pagado', value: 'PAGADO' },
    { label: 'Cancelado', value: 'CANCELADO' }
  ];

  constructor(private fb: FormBuilder, private service: PaymentService, private messageService: MessageService, private router: Router) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      appointment_id: ['', [Validators.required, Validators.min(1)]],
      total_amount: ['', Validators.required],
      consultation_amount: ['', Validators.required],
      procedures_amount: ['', Validators.required],
      payment_method: ['', Validators.required],
      payment_date: ['', Validators.required],
      payment_status: ['PENDIENTE', Validators.required],
      invoice_number: ['']
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: 'Complete los campos requeridos' });
      return;
    }
    this.loading = true;
    const value = this.form.value;
    const data: PaymentI = {
      ...value,
      appointment_id: Number(value.appointment_id),
      payment_date: value.payment_date instanceof Date
        ? value.payment_date.toISOString().split('T')[0]
        : value.payment_date,
      status: 'ACTIVE'
    };
    this.service.create(data).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Pago registrado correctamente' });
        setTimeout(() => this.router.navigate(['/Payment']), 1500);
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error?.message || 'Error al registrar el pago' });
        this.loading = false;
      }
    });
  }

  isInvalid(f: string): boolean {
    const ctrl = this.form.get(f);
    return !!(ctrl && ctrl.invalid && (ctrl.dirty || ctrl.touched));
  }

  onCancel(): void { this.router.navigate(['/Payment']); }
}
