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

import { DoctorI } from '../../../models/doctor.model';
import { DoctorService } from '../../../services/doctor.service';
import { specialtyService } from '../../../services/specialty.service';

@Component({
  selector: 'app-update-doctor',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    InputTextModule,
    SelectModule,
    ButtonModule,
    ToastModule,
    ProgressSpinnerModule
  ],
  templateUrl: './update-doctor.html',
  styleUrl: './update-doctor.css',
  providers: [MessageService]
})
export class UpdateDoctor implements OnInit {
  doctorForm!: FormGroup;
  loading: boolean = false;
  loadingData: boolean = true;
  loadingSpecialties: boolean = true;
  doctorId!: string;

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
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.loadSpecialties();
    this.loadDoctorData();
  }

  initForm(): void {
    this.doctorForm = this.fb.group({
      first_name: ['', [Validators.minLength(2), Validators.maxLength(50)]],
      last_name: ['', [Validators.minLength(2), Validators.maxLength(50)]],
      document: ['', [Validators.minLength(5), Validators.maxLength(20)]],
      phone: ['', [Validators.maxLength(20)]],
      email: ['', [Validators.email, Validators.maxLength(100)]],
      medical_license: ['', [Validators.minLength(4), Validators.maxLength(20)]],
      specialty_id: [null],
      status: ['ACTIVE', Validators.required]
    });
  }

  loadSpecialties(): void {
    this.loadingSpecialties = true;
    this.specialtyService.getAllSpecialty().subscribe({
      next: (specialties) => {
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

  loadDoctorData(): void {
    this.loadingData = true;
    const id = this.route.snapshot.paramMap.get('id');
    
    if (!id) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'ID de doctor no encontrado'
      });
      this.router.navigate(['/Doctor']);
      return;
    }

    this.doctorId = id;
    
    this.doctorService.getDoctorById(this.doctorId).subscribe({
      next: (doctor) => {
        this.doctorForm.patchValue({
          first_name: doctor.first_name,
          last_name: doctor.last_name,
          document: doctor.document,
          phone: doctor.phone || '',
          email: doctor.email || '',
          medical_license: doctor.medical_license,
          specialty_id: doctor.specialty_id,
          status: doctor.status
        });
        this.loadingData = false;
      },
      error: (error) => {
        console.error('Error al cargar doctor:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo cargar el doctor'
        });
        this.loadingData = false;
        setTimeout(() => {
          this.router.navigate(['/Doctor']);
        }, 2000);
      }
    });
  }

  onSubmit(): void {
    if (this.doctorForm.valid) {
      this.loading = true;
      const doctorData: DoctorI = {
        ...this.doctorForm.value
      };

      this.doctorService.updateDoctor(this.doctorId, doctorData).subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Doctor actualizado correctamente'
          });
          setTimeout(() => {
            this.router.navigate(['/Doctor']);
          }, 1500);
        },
        error: (error) => {
          console.error('Error al actualizar doctor:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error?.message || 'Error al actualizar el doctor'
          });
          this.loading = false;
        }
      });
    } else {
      this.markFormGroupTouched(this.doctorForm);
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