import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

// PrimeNG Imports
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';


import { SpecialtyI } from '../../../models/specialty.model';
import { specialtyService } from '../../../services/specialty.service';




@Component({
  selector: 'app-create-specialty',
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    CardModule,
    InputTextModule,
    TextareaModule,
    SelectModule,
    ButtonModule,
    ToastModule],
  templateUrl: './create-specialty.html',
  styleUrl: './create-specialty.css',
  providers: [MessageService]
})
export class CreateSpecialty implements OnInit {
  specialtyForm!: FormGroup;
  loading: boolean = false;

  statusOptions = [
    { label: 'Activo', value: 'ACTIVE' },
    { label: 'Inactivo', value: 'INACTIVE' }
  ];

  constructor(
    private fb: FormBuilder,
    private specialtyService: specialtyService,
    private messageService: MessageService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.specialtyForm = this.fb.group({
      specialty_name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(500)]],
      status: ['ACTIVE', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.specialtyForm.valid) {
      this.loading = true;
      const specialtyData: SpecialtyI = this.specialtyForm.value;

      this.specialtyService.createSpecialty(specialtyData).subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Especialidad registrada correctamente'
          });
          setTimeout(() => {
            this.router.navigate(['/Specialty']);
          }, 1500);
        },
        error: (error) => {
          console.error('Error al crear especialidad:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error?.message || 'Error al registrar la especialidad'
          });
          this.loading = false;
        }
      });
    } else {
      this.markFormGroupTouched(this.specialtyForm);
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
    this.router.navigate(['/Specialty']);
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.specialtyForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getErrorMessage(fieldName: string): string {
    const field = this.specialtyForm.get(fieldName);
    if (field?.hasError('required')) {
      return 'Este campo es requerido';
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