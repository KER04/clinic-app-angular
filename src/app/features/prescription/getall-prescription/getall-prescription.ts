import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmationService, MessageService } from 'primeng/api';
import { PrescriptionI } from '../../../core/models/prescription.model';
import { PrescriptionService } from '../../../core/services/prescription.service';

@Component({
  selector: 'app-getall-prescription',
  standalone: true,
  imports: [CommonModule, RouterModule, TableModule, ButtonModule, ToastModule, ConfirmDialogModule, TooltipModule],
  templateUrl: './getall-prescription.html',
  styleUrl: './getall-prescription.css',
  encapsulation: ViewEncapsulation.None,
  providers: [ConfirmationService, MessageService]
})
export class GetallPrescription implements OnInit {
  prescriptions: PrescriptionI[] = [];
  loading = true;

  constructor(
    private prescriptionService: PrescriptionService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.prescriptionService.getAll().subscribe({
      next: (data) => { this.prescriptions = data; this.loading = false; },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al cargar las prescripciones' });
        this.loading = false;
      }
    });
  }

  toggleStatus(item: PrescriptionI): void {
    if (!item.id) return;
    const newStatus = item.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    const action = newStatus === 'ACTIVE' ? 'activar' : 'desactivar';
    this.confirmationService.confirm({
      message: `¿Está seguro que desea ${action} esta prescripción?`,
      header: 'Confirmar acción',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí', rejectLabel: 'No',
      accept: () => {
        this.prescriptionService.update(item.id!, { ...item, status: newStatus }).subscribe({
          next: () => {
            item.status = newStatus;
            this.messageService.add({ severity: 'success', summary: 'Éxito', detail: `Prescripción ${newStatus === 'ACTIVE' ? 'activada' : 'desactivada'} correctamente` });
          },
          error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: `Error al ${action} la prescripción` })
        });
      }
    });
  }
}
