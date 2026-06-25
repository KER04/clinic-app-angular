import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

// PrimeNG Imports
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

import { DoctorI } from '../../../core/models/doctor.model';
import { DoctorService } from '../../../core/services/doctor.service';
import { specialtyService } from '../../../core/services/specialty.service';
import { SpecialtyI } from '../../../core/models/specialty.model';

@Component({
  selector: 'app-create-doctor',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    InputTextModule,
    SelectModule,
    ButtonModule,
    ToastModule
  ],
  templateUrl: './create-doctor.html',
  styleUrl: './create-doctor.css',
  providers: [MessageService]  
})

export class CreateDoctor implements OnInit {
  doctorForm!: FormGroup;
  loading: boolean = false;
  loadingSpecialties: boolean = true;

  statusOptions = [
    { label: 'Activo', value: 'ACTIVE' },
    { label: 'Inactivo', value: 'INACTIVE' }
  ];

  specialtyOptions: { label: string; value: number }[] = [];

  constructor(
    private fb: FormBuilder,
    private doctorService: DoctorService,
    private specialtyService: specialtyService,
    private messageService: MessageService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.loadSpecialties();
  }

  initForm(): void {
    this.doctorForm = this.fb.group({
      first_name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      last_name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      document: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(20)]],
      phone: ['', [Validators.maxLength(20)]],
      email: ['', [Validators.email, Validators.maxLength(100)]],
      medical_license: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(20)]],
      specialty_id: [null, Validators.required],
      status: ['ACTIVE', Validators.required]
    });
  }

  loadSpecialties(): void {
    this.loadingSpecialties = true;
    this.specialtyService.getAllSpecialty().subscribe({
      next: (specialties) => {
        // Filtrar solo especialidades activas
        const activeSpecialties = specialties.filter(s => s.status === 'ACTIVE');
        
        this.specialtyOptions = activeSpecialties.map(specialty => ({
          label: specialty.specialty_name,
          value: specialty.id!
        }));
        this.loadingSpecialties = false;
      },
      error: (error) => {
        console.error('Error al cargar especialidades:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar las especialidades'
        });
        this.loadingSpecialties = false;
      }
    });
  }

  onSubmit(): void {
    if (this.doctorForm.valid) {
      this.loading = true;
      const doctorData: DoctorI = this.doctorForm.value;

      this.doctorService.createDoctor(doctorData).subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Doctor registrado correctamente'
          });
          setTimeout(() => {
            this.router.navigate(['/Doctor']);
          }, 1500);
        },
        error: (error) => {
          console.error('Error al crear doctor:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error?.message || 'Error al registrar el doctor'
          });
          this.loading = false;
        }
      });
    } else {
      this.markFormGroupTouched(this.doctorForm);
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
    this.router.navigate(['/Doctor']);
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.doctorForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getErrorMessage(fieldName: string): string {
    const field = this.doctorForm.get(fieldName);
    if (field?.hasError('required')) {
      return 'Este campo es requerido';
    }
    if (field?.hasError('email')) {
      return 'Ingrese un correo electrónico válido';
    }
    if (field?.hasError('minlength')) {
      const minLength = field.errors?.['minlength'].requiredLength;
      return `Mínimo ${minLength} caracteres`;
    }
    if (field?.hasError('maxlength')) {
      const maxLength = field.errors?.['maxlength'].requiredLength;
      return `Máximo ${maxLength} caracteres`;
    }
    return '';
  }
}