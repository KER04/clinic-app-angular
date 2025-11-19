import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { AppointmentI } from '../../../models/appointment.model';
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';
import { AppointmentService } from '../../../services/appointment.service';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-getall-appointment',
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
  templateUrl: './getall-appointment.html',
  styleUrl: './getall-appointment.css',
  encapsulation: ViewEncapsulation.None,
  providers: [ConfirmationService, MessageService]
})
export class GetallAppointment implements OnInit {

  appointments: AppointmentI[] = [];
  loading: boolean = true;
  lastError: string | null = null;

  constructor(
    private appointmentService: AppointmentService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadAppointments();
  }

  // Mejorado: logs + manejo de diferentes shapes
  loadAppointments(): void {
  this.loading = true;
  this.lastError = null;

  this.appointmentService.getAllAppointments().subscribe({
    next: (resp) => {
      console.log('[GetAllAppointment] raw response:', resp);

      let apps: AppointmentI[] = [];

      // ⬅️ ESTA ES LA CLAVE
      if (resp && Array.isArray((resp as any).appointment)) {
        apps = (resp as any).appointment;
      } 
      else if (Array.isArray(resp)) {
        apps = resp;
      }
      else if ((resp as any).appointments && Array.isArray((resp as any).appointments)) {
        apps = (resp as any).appointments;
      }

      this.appointments = apps.map(a => ({
        ...a,
        appointment_datetime: a.appointment_datetime ? new Date(a.appointment_datetime) : a.appointment_datetime
      }));

      console.log('[GetAllAppointment] normalized appointments:', this.appointments);

      this.loading = false;
    },
    error: (error) => {
      console.error('Error loading appointments:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Error al cargar las citas'
      });
      this.loading = false;
    }
  });
}
  toggleStatus(app: AppointmentI): void {
    if (!app.id) return;
    const newStatus = app.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    const action = newStatus === 'INACTIVE' ? 'desactivar' : 'activar';

    this.confirmationService.confirm({
      message: `¿Está seguro que desea ${action} la cita #${app.id}?`,
      header: 'Confirmar acción',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      accept: () => {
        const updatedAppointment: AppointmentI = {
          ...app,
          status: newStatus
        };

        this.appointmentService.updateAppointment(app.id!.toString(), updatedAppointment)
          .subscribe({
            next: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Éxito',
                detail: `Cita ${action} correctamente`
              });
              this.loadAppointments();
            },
            error: (error) => {
              console.error('Error al cambiar estado:', error);
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: `Error al ${action} la cita`
              });
            }
          });
      }
    });
  }

  trackById(index: number, item: AppointmentI) {
    return item.id ?? index;
  }
}