import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

// PrimeNG
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

import { AppointmentI } from '../../../models/appointment.model';
import { AppointmentService } from '../../../services/appointment.service';
import { PatientService } from '../../../services/patient.service';
import { DoctorService } from '../../../services/doctor.service';

@Component({
  selector: 'app-create-appointment',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    InputTextModule,
    ButtonModule,
    ToastModule
  ],
  templateUrl: './create-appointment.html',
  styleUrls: ['./create-appointment.css'],
  providers: [MessageService]
})
export class CreateAppointment implements OnInit {

  appointmentForm!: FormGroup;

  loading = false;

  // Listas
  patientsList: any[] = [];
  filteredPatients: any[] = [];

  doctorsList: any[] = [];
  filteredDoctors: any[] = [];

  constructor(
    private fb: FormBuilder,
    private appointmentService: AppointmentService,
    private patientService: PatientService,
    private doctorService: DoctorService,
    private messageService: MessageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadPatients();
    this.loadDoctors();
  }

  // ============================================
  // FORMULARIO
  // ============================================
  initForm(): void {
    this.appointmentForm = this.fb.group({
      patient_id: [null, Validators.required],
      patient_name: [''], // solo texto visible

      doctor_id: [null, Validators.required],
      doctor_name: [''], // solo texto visible

      appointment_datetime: ['', Validators.required],

      consultation_reason: ['', [Validators.maxLength(200)]],

      status: ['ACTIVE', Validators.required],

      observations: ['']
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

    // Marcar como tocado y actualizar validez
    const control = this.appointmentForm.get('patient_id');
    control?.markAsTouched();
    control?.updateValueAndValidity();

    this.filteredPatients = []; // cerrar menú
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

    // Marcar como tocado y actualizar validez
    const control = this.appointmentForm.get('doctor_id');
    control?.markAsTouched();
    control?.updateValueAndValidity();

    this.filteredDoctors = [];
  }

  // ============================================
  // VALIDACIÓN DE CAMPO
  // ============================================
  isFieldInvalid(field: string): boolean {
    const control = this.appointmentForm.get(field);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  // ============================================
  // GUARDAR CITA
  // ============================================
  onSubmit(): void {
    // Marcar todos los campos como touched para mostrar errores
    Object.keys(this.appointmentForm.controls).forEach(key => {
      this.appointmentForm.get(key)?.markAsTouched();
    });

    if (this.appointmentForm.invalid) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Campos incompletos',
        detail: 'Complete todos los campos obligatorios'
      });
      return;
    }

    const data: AppointmentI = {
      patient_id: this.appointmentForm.value.patient_id,
      doctor_id: this.appointmentForm.value.doctor_id,
      appointment_datetime: this.appointmentForm.value.appointment_datetime,
      consultation_reason: this.appointmentForm.value.consultation_reason,
      status: this.appointmentForm.value.status,
      observations: this.appointmentForm.value.observations
    };

    this.loading = true;

    this.appointmentService.createAppointment(data).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Cita registrada correctamente'
        });

        setTimeout(() => this.router.navigate(['/Appointment']), 1500);
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error?.message || 'No se pudo registrar la cita'
        });
        this.loading = false;
      }
    });
  }

  // ============================================
  // CANCELAR
  // ============================================
  onCancel(): void {
    this.router.navigate(['/Appointment']);
  }
}