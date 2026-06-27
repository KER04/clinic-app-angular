import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PrescriptionI } from '../../../core/models/prescription.model';
import { PrescriptionService } from '../../../core/services/prescription.service';

type ToastType = 'success' | 'error' | 'warn';

interface Toast {
  type: ToastType;
  message: string;
}

@Component({
  selector: 'app-create-prescription',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-prescription.html',
  styleUrl: './create-prescription.css'
})
export class CreatePrescription implements OnInit {
  form!: FormGroup;
  loading = false;
  toast: Toast | null = null;

  constructor(
    private fb: FormBuilder,
    private service: PrescriptionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      appointment_id: ['', [Validators.required, Validators.min(1)]],
      doctor_id:      ['', [Validators.required, Validators.min(1)]],
      issue_date:     ['', Validators.required],
      general_instructions: ['']
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.showToast('warn', 'Completa todos los campos requeridos.');
      return;
    }

    this.loading = true;
    const v = this.form.value;
    const data: PrescriptionI = {
      appointment_id: Number(v.appointment_id),
      doctor_id:      Number(v.doctor_id),
      issue_date:     v.issue_date,
      general_instructions: v.general_instructions || undefined,
      status: 'ACTIVE'
    };

    this.service.create(data).subscribe({
      next: () => {
        this.showToast('success', 'Prescripción registrada correctamente.');
        setTimeout(() => this.router.navigate(['/Prescription']), 1500);
      },
      error: (err) => {
        this.showToast('error', err.error?.message || 'Error al registrar la prescripción.');
        this.loading = false;
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/Prescription']);
  }

  isInvalid(field: string): boolean {
    const ctrl = this.form.get(field);
    return !!(ctrl && ctrl.invalid && (ctrl.dirty || ctrl.touched));
  }

  private showToast(type: ToastType, message: string): void {
    this.toast = { type, message };
    setTimeout(() => (this.toast = null), 3500);
  }
}
