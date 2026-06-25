import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageService } from 'primeng/api';
import { PaymentI } from '../../../core/models/payment.model';
import { PaymentService } from '../../../core/services/payment.service';

@Component({
  selector: 'app-update-payment',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CardModule, InputTextModule, DatePickerModule, SelectModule, ButtonModule, ToastModule, ProgressSpinnerModule],
  templateUrl: './update-payment.html',
  styleUrl: './update-payment.css',
  providers: [MessageService]
})
export class UpdatePayment implements OnInit {
  form!: FormGroup;
  loading = false;
  loadingData = true;
  itemId!: number;

  statusOptions = [
    { label: 'Activo', value: 'ACTIVE' },
    { label: 'Inactivo', value: 'INACTIVE' }
  ];

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

  constructor(private fb: FormBuilder, private service: PaymentService, private messageService: MessageService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      appointment_id: ['', [Validators.required, Validators.min(1)]],
      total_amount: ['', Validators.required],
      consultation_amount: ['', Validators.required],
      procedures_amount: ['', Validators.required],
      payment_method: ['', Validators.required],
      payment_date: [null, Validators.required],
      payment_status: ['PENDIENTE', Validators.required],
      invoice_number: [''],
      status: ['ACTIVE', Validators.required]
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (!id) { this.router.navigate(['/Payment']); return; }
    this.itemId = Number(id);

    this.service.getById(this.itemId).subscribe({
      next: (item) => {
        this.form.patchValue({ ...item, payment_date: new Date(item.payment_date) });
        this.loadingData = false;
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo cargar el pago' });
        this.loadingData = false;
        setTimeout(() => this.router.navigate(['/Payment']), 2000);
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: 'Verifique los campos del formulario' });
      return;
    }
    this.loading = true;
    const value = this.form.value;
    const data: PaymentI = {
      ...value,
      appointment_id: Number(value.appointment_id),
      payment_date: value.payment_date instanceof Date
        ? value.payment_date.toISOString().split('T')[0]
        : value.payment_date
    };
    this.service.update(this.itemId, data).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Pago actualizado correctamente' });
        setTimeout(() => this.router.navigate(['/Payment']), 1500);
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error?.message || 'Error al actualizar' });
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
