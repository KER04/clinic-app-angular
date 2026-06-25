import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

// PrimeNG Imports
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

import { SpecialtyI } from '../../../core/models/specialty.model';
import { specialtyService } from '../../../core/services/specialty.service';



@Component({
  selector: 'app-update-specialty',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    InputTextModule,
    TextareaModule,
    SelectModule,
    ButtonModule,
    ToastModule,
    ProgressSpinnerModule
  ],
  templateUrl: './update-specialty.html',
  styleUrl: './update-specialty.css',
  providers: [MessageService]
})
export class UpdateSpecialty implements OnInit {
  specialtyForm!: FormGroup;
  loading: boolean = false;
  loadingData: boolean = true;
  specialtyId!: string;

  statusOptions = [
    { label: 'Activo', value: 'ACTIVE' },
    { label: 'Inactivo', value: 'INACTIVE' }
  ];

  constructor(
    private fb: FormBuilder,
    private specialtyService: specialtyService,
    private messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.loadSpecialtyData();
  }

  initForm(): void {
    this.specialtyForm = this.fb.group({
      specialty_name: ['', [ Validators.minLength(3), Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(500)]],
      status: ['ACTIVE', Validators.required]
    });
  }

  loadSpecialtyData(): void {
    this.loadingData = true;
    const id = this.route.snapshot.paramMap.get('id');
    
    if (!id) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'ID de especialidad no encontrado'
      });
      this.router.navigate(['/Specialty']);
      return;
    }

    this.specialtyId = id;
    
    this.specialtyService.getSpecialtyById(this.specialtyId).subscribe({
      next: (specialty) => {
        this.specialtyForm.patchValue({
          specialty_name: specialty.specialty_name,
          description: specialty.description || '',
          status: specialty.status
        });
        this.loadingData = false;
      },
      error: (error) => {
        console.error('Error al cargar especialidad:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo cargar la especialidad'
        });
        this.loadingData = false;
        setTimeout(() => {
          this.router.navigate(['/Specialty']);
        }, 2000);
      }
    });
  }

  onSubmit(): void {
    if (this.specialtyForm.valid) {
      this.loading = true;
      const specialtyData: SpecialtyI = {
        id: this.specialtyId,
        ...this.specialtyForm.value
      };

      this.specialtyService.updateSpecialty(this.specialtyId, specialtyData).subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Especialidad actualizada correctamente'
          });
          setTimeout(() => {
            this.router.navigate(['/Specialty']);
          }, 1500);
        },
        error: (error) => {
          console.error('Error al actualizar especialidad:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error?.message || 'Error al actualizar la especialidad'
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
