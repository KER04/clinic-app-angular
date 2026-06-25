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
import { DiagnosisI } from '../../../core/models/diagnosis.model';
import { DiagnosisService } from '../../../core/services/diagnosis.service';

@Component({
  selector: 'app-create-diagnosis',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CardModule, InputTextModule, DatePickerModule, ButtonModule, ToastModule],
  templateUrl: './create-diagnosis.html',
  styleUrl: './create-diagnosis.css',
  providers: [MessageService]
})
export class CreateDiagnosis implements OnInit {
  form!: FormGroup;
  loading = false;

  constructor(private fb: FormBuilder, private service: DiagnosisService, private messageService: MessageService, private router: Router) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      patient_id: ['', [Validators.required, Validators.min(1)]],
      appointment_id: ['', [Validators.required, Validators.min(1)]],
      icd10_code: [''],
      description: ['', [Validators.required, Validators.minLength(5)]],
      diagnosis_date: ['', Validators.required],
      observations: ['']
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
    const data: DiagnosisI = {
      ...value,
      patient_id: Number(value.patient_id),
      appointment_id: Number(value.appointment_id),
      diagnosis_date: value.diagnosis_date instanceof Date
        ? value.diagnosis_date.toISOString().split('T')[0]
        : value.diagnosis_date,
      status: 'ACTIVE'
    };
    this.service.create(data).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Diagnóstico registrado correctamente' });
        setTimeout(() => this.router.navigate(['/Diagnosis']), 1500);
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error?.message || 'Error al registrar el diagnóstico' });
        this.loading = false;
      }
    });
  }

  isInvalid(f: string): boolean {
    const ctrl = this.form.get(f);
    return !!(ctrl && ctrl.invalid && (ctrl.dirty || ctrl.touched));
  }

  onCancel(): void { this.router.navigate(['/Diagnosis']); }
}
