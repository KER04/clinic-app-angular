import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

// PrimeNG Imports
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DatePickerModule } from 'primeng/datepicker';

import { PatientI } from '../../../models/patient.model';
import { PatientService } from '../../../services/patient.service';

@Component({
  selector: 'app-update-patient',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    InputTextModule,
    SelectModule,
    ButtonModule,
    ToastModule,
    ProgressSpinnerModule,
    DatePickerModule
  ],
  templateUrl: './update-patient.html',
  styleUrl: './update-patient.css',
  providers: [MessageService]
})
export class UpdatePatient implements OnInit {
  patientForm!: FormGroup;
  loading: boolean = false;
  loadingData: boolean = true;
  patientId!: number;

  statusOptions = [
    { label: 'Activo', value: 'ACTIVE' },
    { label: 'Inactivo', value: 'INACTIVE' }
  ];

  genderOptions = [
    { label: 'Masculino', value: 'M' },
    { label: 'Femenino', value: 'F' }
  ];

  constructor(
    private fb: FormBuilder,
    private patientService: PatientService,
    private messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.loadPatientData();
  }

  initForm(): void {
    this.patientForm = this.fb.group({
      first_name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      last_name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      document: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(20)]],
      birth_date: [null, Validators.required],
      phone: ['', [Validators.maxLength(20)]],
      email: ['', [Validators.email, Validators.maxLength(100)]],
      address: ['', [Validators.maxLength(200)]],
      gender: ['M', Validators.required],
      status: ['ACTIVE', Validators.required]
    });
  }

  loadPatientData(): void {
    this.loadingData = true;
    const id = this.route.snapshot.paramMap.get('id');
    
    if (!id) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'ID de paciente no encontrado'
      });
      this.router.navigate(['/Patient']);
      return;
    }

    this.patientId = parseInt(id);
    
    this.patientService.getPatientById(this.patientId).subscribe({
      next: (patient) => {
        this.patientForm.patchValue({
          first_name: patient.first_name,
          last_name: patient.last_name,
          document: patient.document,
          birth_date: new Date(patient.birth_date),
          phone: patient.phone || '',
          email: patient.email || '',
          address: patient.address || '',
          gender: patient.gender,
          status: patient.status
        });
        this.loadingData = false;
      },
      error: (error) => {
        console.error('Error al cargar paciente:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo cargar el paciente'
        });
        this.loadingData = false;
        setTimeout(() => {
          this.router.navigate(['/Patient']);
        }, 2000);
      }
    });
  }

  onSubmit(): void {
    if (this.patientForm.valid) {
      this.loading = true;
      const patientData: PatientI = {
        ...this.patientForm.value
      };

      this.patientService.updatePatient(this.patientId, patientData).subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Paciente actualizado correctamente'
          });
          setTimeout(() => {
            this.router.navigate(['/Patient']);
          }, 1500);
        },
        error: (error) => {
          console.error('Error al actualizar paciente:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error?.message || 'Error al actualizar el paciente'
          });
          this.loading = false;
        }
      });
    } else {
      this.markFormGroupTouched(this.patientForm);
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Por favor verifique los campos del formulario'
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
    this.router.navigate(['/Patient']);
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.patientForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getErrorMessage(fieldName: string): string {
    const field = this.patientForm.get(fieldName);
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
