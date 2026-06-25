import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { PatientI } from '../../../core/models/patient.model';
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';
import { PatientService } from '../../../core/services/patient.service';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-getall-patient',
  imports: [
    TableModule, 
    CommonModule, 
    ButtonModule, 
    RouterModule, 
    ConfirmDialogModule, 
    ToastModule,
    TooltipModule
  ],
  templateUrl: './getall-patient.html',
  styleUrl: './getall-patient.css',
  encapsulation: ViewEncapsulation.None,
  providers: [ConfirmationService, MessageService]
})
export class GetallPatient implements OnInit {
  patients: PatientI[] = [];
  loading: boolean = true;

  constructor(
    private patientService: PatientService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.loadPatient();
  }

  loadPatient(): void {
    this.loading = true;
    this.patientService.getAllPatients().subscribe({
      next: (patients) => {
        this.patients = patients;
        this.patientService.updateLocalPatients(patients);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading patients:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar los pacientes'
        });
        this.loading = false;
      }
    });
  }
toggleStatus(patient: PatientI): void {
  // Verificar que el paciente tenga ID
  if (!patient.id) {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: 'No se puede actualizar un paciente sin ID'
    });
    return;
  }

  const patientId = patient.id;
  const newStatus = patient.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
  const action = newStatus === 'ACTIVE' ? 'activar' : 'desactivar';
  
  this.confirmationService.confirm({
    message: `¿Está seguro que desea ${action} al paciente ${patient.first_name} ${patient.last_name}?`,
    header: 'Confirmar acción',
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: 'Sí',
    rejectLabel: 'No',
    accept: () => {
      // Crear objeto tipado correctamente
      const updatedPatient: PatientI = { 
        ...patient, 
        status: newStatus 
      };
      
      this.patientService.updatePatient(patientId, updatedPatient).subscribe({
        next: () => {
          patient.status = newStatus;
          
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: `Paciente ${action === 'activar' ? 'activado' : 'desactivado'} correctamente`
          });
        },
        error: (error) => {
          console.error('Error updating patient status:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: `Error al ${action} el paciente`
          });
        }
      });
    },
    reject: () => {
      this.messageService.add({
        severity: 'info',
        summary: 'Cancelado',
        detail: 'Acción cancelada'
      });
    }
  });
}
}