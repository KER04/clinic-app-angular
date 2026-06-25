import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

// PrimeNG
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

import { AppointmentI } from '../../../core/models/appointment.model';
import { AppointmentService } from '../../../core/services/appointment.service';
import { PatientService } from '../../../core/services/patient.service';
import { DoctorService } from '../../../core/services/doctor.service';

@Component({
  selector: 'app-update-appointment',
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
  templateUrl: './update-appointment.html',
  styleUrl: './update-appointment.css',
  providers: [MessageService]
})
export class UpdateAppointment implements OnInit {

  appointmentForm!: FormGroup;
  loading: boolean = false;
  loadingData: boolean = true;
  appointmentId!: string;

  // Listas
  patientsList: any[] = [];
  filteredPatients: any[] = [];

  doctorsList: any[] = [];
  filteredDoctors: any[] = [];

  statusOptions = [
    { label: 'Activa', value: 'ACTIVE' },
    { label: 'Completada', value: 'COMPLETED' },
    { label: 'Cancelada', value: 'CANCELLED' }
  ];

  constructor(
    private fb: FormBuilder,
    private appointmentService: AppointmentService,
    private patientService: PatientService,
    private doctorService: DoctorService,
    private messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadPatients();
    this.loadDoctors();
    this.loadAppointmentData();
  }

  // ============================================
  // FORMULARIO
  // ============================================
  initForm(): void {
    this.appointmentForm = this.fb.group({
      patient_id: [null, Validators.required],
      patient_name: [''],

      doctor_id: [null, Validators.required],
      doctor_name: [''],

      appointment_datetime: ['', Validators.required],

      consultation_reason: ['', [Validators.maxLength(200)]],

      status: ['ACTIVE', Validators.required],

      observations: ['']
    });
  }

  // ============================================
  // CARGAR DATOS DE LA CITA
  // ============================================
  loadAppointmentData(): void {
    this.loadingData = true;
    const id = this.route.snapshot.paramMap.get('id');
    
    if (!id) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'ID de cita no encontrado'
      });
      this.router.navigate(['/Appointment']);
      return;
    }

    this.appointmentId = id;
    
    this.appointmentService.getAppointmentById(this.appointmentId).subscribe({
      next: (appointment) => {
        // Buscar el paciente y doctor en las listas
        const patient = this.patientsList.find(p => p.id === appointment.patient_id);
        const doctor = this.doctorsList.find(d => d.id === appointment.doctor_id);

        this.appointmentForm.patchValue({
          patient_id: appointment.patient_id,
          patient_name: patient ? `${patient.first_name} ${patient.last_name}` : '',
          doctor_id: appointment.doctor_id,
          doctor_name: doctor ? `${doctor.first_name} ${doctor.last_name}` : '',
          appointment_datetime: appointment.appointment_datetime,
          consultation_reason: appointment.consultation_reason || '',
          status: appointment.status,
          observations: appointment.observations || ''
        });
        this.loadingData = false;
      },
      error: (error) => {
        console.error('Error al cargar cita:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo cargar la cita'
        });
        this.loadingData = false;
        setTimeout(() => {
          this.router.navigate(['/Appointment']);
        }, 2000);
      }
    });
  }

  // ============================================
  // PACIENTES
  // ============================================
  loadPatients(): void {
    this.patientService.getAllPatients().subscribe({
      next: (patients) => {
        this.patientsList = patients.filter(p => p.status === 'ACTIVE');
        this.filteredPatients = [];
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar pacientes'
        });
      }
    });
  }

  filterPatients(event: any): void {
    const value = event.target.value.toLowerCase().trim();

    if (value === '') {
      this.filteredPatients = [];
      return;
    }

    this.filteredPatients = this.patientsList.filter(p =>
      `${p.first_name} ${p.last_name}`.toLowerCase().includes(value) ||
      p.document?.toLowerCase().includes(value)
    );
  }

  selectPatient(p: any): void {
    this.appointmentForm.patchValue({
      patient_id: p.id,
      patient_name: `${p.first_name} ${p.last_name}`
    });

    const control = this.appointmentForm.get('patient_id');
    control?.markAsTouched();
    control?.markAsDirty();
    control?.updateValueAndValidity();

    this.filteredPatients = [];
  }

  // ============================================
  // DOCTORES
  // ============================================
  loadDoctors(): void {
    this.doctorService.getAllDoctors().subscribe({
      next: (docs) => {
        this.doctorsList = docs.filter(d => d.status === 'ACTIVE');
        this.filteredDoctors = [];
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar doctores'
        });
      }
    });
  }

  filterDoctors(event: any): void {
    const value = event.target.value.toLowerCase().trim();

    if (value === '') {
      this.filteredDoctors = [];
      return;
    }

    this.filteredDoctors = this.doctorsList.filter(d =>
      `${d.first_name} ${d.last_name}`.toLowerCase().includes(value)
    );
  }

  selectDoctor(d: any): void {
    this.appointmentForm.patchValue({
      doctor_id: d.id,
      doctor_name: `${d.first_name} ${d.last_name}`
    });

    const control = this.appointmentForm.get('doctor_id');
    control?.markAsTouched();
    control?.markAsDirty();
    control?.updateValueAndValidity();

    this.filteredDoctors = [];
  }

  // ============================================
  // VALIDACIÓN
  // ============================================
  isFieldInvalid(field: string): boolean {
    const control = this.appointmentForm.get(field);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  getErrorMessage(fieldName: string): string {
    const field = this.appointmentForm.get(fieldName);
    if (field?.hasError('required')) {
      return 'Este campo es requerido';
    }
    if (field?.hasError('maxlength')) {
      const maxLength = field.errors?.['maxlength'].requiredLength;
      return `Máximo ${maxLength} caracteres`;
    }
    return '';
  }

  // ============================================
  // ACTUALIZAR CITA
  // ============================================
  onSubmit(): void {
    if (this.appointmentForm.valid) {
      this.loading = true;
      
      const data: AppointmentI = {
        patient_id: this.appointmentForm.value.patient_id,
        doctor_id: this.appointmentForm.value.doctor_id,
        appointment_datetime: this.appointmentForm.value.appointment_datetime,
        consultation_reason: this.appointmentForm.value.consultation_reason,
        status: this.appointmentForm.value.status,
        observations: this.appointmentForm.value.observations
      };

      this.appointmentService.updateAppointment(this.appointmentId, data).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Cita actualizada correctamente'
          });
          setTimeout(() => {
            this.router.navigate(['/Appointment']);
          }, 1500);
        },
        error: (error) => {
          console.error('Error al actualizar cita:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error?.message || 'Error al actualizar la cita'
          });
          this.loading = false;
        }
      });
    } else {
      this.markFormGroupTouched(this.appointmentForm);
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

  // ============================================
  // CANCELAR
  // ============================================
  onCancel(): void {
    this.router.navigate(['/Appointment']);
  }
}
