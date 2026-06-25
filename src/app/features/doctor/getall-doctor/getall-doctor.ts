import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { DoctorI } from '../../../core/models/doctor.model';
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';
import { DoctorService } from '../../../core/services/doctor.service';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-getall-doctor',
  standalone: true,
  imports: [
    TableModule,
    CommonModule,
    ButtonModule,
    RouterModule,
    ConfirmDialogModule,
    ToastModule,
    TooltipModule
  ],
  templateUrl: './getall-doctor.html',
  styleUrl: './getall-doctor.css',
  encapsulation: ViewEncapsulation.None,
  providers: [ConfirmationService, MessageService]
})

export class GetallDoctor implements OnInit {
  doctors: DoctorI[] = [];
  loading: boolean = true;

  constructor(
    private doctorService: DoctorService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.loadDoctors();
  }

  loadDoctors(): void {
    this.loading = true;
    this.doctorService.getAllDoctors().subscribe({
      next: (doctors) => {
        this.doctors = doctors;
        this.doctorService.updateLocalDoctors(doctors);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading doctors:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar los doctores'
        });
        this.loading = false;
      }
    });
  }

  toggleStatus(doctor: DoctorI): void {
    const newStatus = doctor.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    const action = newStatus === 'INACTIVE' ? 'desactivar' : 'activar';
    
    this.confirmationService.confirm({
      message: `¿Está seguro que desea ${action} al Dr. ${doctor.first_name} ${doctor.last_name}?`,
      header: 'Confirmar acción',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      accept: () => {
        const updatedDoctor: DoctorI = {
          ...doctor,
          status: newStatus
        };

        this.doctorService.updateDoctor(doctor.id!.toString(), updatedDoctor).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: `Doctor ${action}do correctamente`
            });
            this.loadDoctors();
          },
          error: (error) => {
            console.error('Error al cambiar estado:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: `Error al ${action} el doctor`
            });
          }
        });
      }
    });
  }
}