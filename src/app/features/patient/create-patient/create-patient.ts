import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

// PrimeNG
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

import { PatientI } from '../../../core/models/patient.model';
import { PatientService } from '../../../core/services/patient.service';

@Component({
  selector: 'app-create-patient',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    InputTextModule,
    DatePickerModule,
    SelectModule,
    ButtonModule,
    ToastModule
  ],
  templateUrl: './create-patient.html',
  styleUrl: './create-patient.css',
  providers: [MessageService]
})
export class CreatePatient implements OnInit {

  patientForm!: FormGroup;
  loading: boolean = false;

  genderOptions = [
    { label: 'Masculino', value: 'M' },
    { label: 'Femenino', value: 'F' }
  ];

  statusOptions = [
    { label: 'Activo', value: 'ACTIVE' },
    { label: 'Inactivo', value: 'INACTIVE' }
  ];

  constructor(
    private fb: FormBuilder,
    private patientService: PatientService,
    private messageService: MessageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.patientForm = this.fb.group({
      first_name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      last_name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      document: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(20)]],
      birth_date: ['', Validators.required],
      phone: ['', Validators.maxLength(20)],
      email: ['', [Validators.email, Validators.maxLength(100)]],
      address: ['', Validators.maxLength(150)],
      gender: ['', Validators.required],
      status: ['ACTIVE', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.patientForm.valid) {
      this.loading = true;
      const patientData: PatientI = this.patientForm.value;

      this.patientService.createPatient(patientData).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Paciente registrado correctamente'
          });

          setTimeout(() => this.router.navigate(['/patients']), 1500);
        },
        error: (error) => {
          console.error('Error al crear paciente:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error?.message || 'Error al registrar el paciente'
          });
          this.loading = false;
        }
      });

    } else {
      this.markFormGroupTouched(this.patientForm);
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Por favor complete todos los campos requeridos correctamente'
      });
    }
  }

  markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  onCancel(): void {
    this.router.navigate(['/patients']);
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.patientForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getErrorMessage(fieldName: string): string {
    const field = this.patientForm.get(fieldName);

    if (field?.hasError('required')) return 'Este campo es obligatorio';

    if (field?.hasError('email')) return 'Ingrese un correo válido';

    if (field?.hasError('minlength')) {
      const min = field.errors?.['minlength'].requiredLength;
      return `Debe tener al menos ${min} caracteres`;
    }

    if (field?.hasError('maxlength')) {
      const max = field.errors?.['maxlength'].requiredLength;
      return `Máximo ${max} caracteres permitidos`;
    }

    return '';
  }
}
