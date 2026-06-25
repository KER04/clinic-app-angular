import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { DatePickerModule } from 'primeng/datepicker';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { PrescriptionI } from '../../../core/models/prescription.model';
import { PrescriptionService } from '../../../core/services/prescription.service';

@Component({
  selector: 'app-create-prescription',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CardModule, InputTextModule, DatePickerModule, ButtonModule, ToastModule],
  templateUrl: './create-prescription.html',
  styleUrl: './create-prescription.css',
  providers: [MessageService]
})
export class CreatePrescription implements OnInit {
  form!: FormGroup;
  loading = false;

  constructor(private fb: FormBuilder, private service: PrescriptionService, private messageService: MessageService, private router: Router) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      appointment_id: ['', [Validators.required, Validators.min(1)]],
      doctor_id: ['', [Validators.required, Validators.min(1)]],
      issue_date: ['', Validators.required],
      general_instructions: ['']
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
    const data: PrescriptionI = {
      ...value,
      appointment_id: Number(value.appointment_id),
      doctor_id: Number(value.doctor_id),
      issue_date: value.issue_date instanceof Date
        ? value.issue_date.toISOString().split('T')[0]
        : value.issue_date,
      status: 'ACTIVE'
    };
    this.service.create(data).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Prescripción registrada correctamente' });
        setTimeout(() => this.router.navigate(['/Prescription']), 1500);
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error?.message || 'Error al registrar la prescripción' });
        this.loading = false;
      }
    });
  }

  isInvalid(f: string): boolean {
    const ctrl = this.form.get(f);
    return !!(ctrl && ctrl.invalid && (ctrl.dirty || ctrl.touched));
  }

  onCancel(): void { this.router.navigate(['/Prescription']); }
}
