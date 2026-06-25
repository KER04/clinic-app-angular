import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmationService, MessageService } from 'primeng/api';
import { PrescriptionDetailI } from '../../../core/models/prescriptiondetail.model';
import { PrescriptionDetailService } from '../../../core/services/prescriptiondetail.service';

@Component({
  selector: 'app-getall-prescriptiondetail',
  standalone: true,
  imports: [CommonModule, RouterModule, TableModule, ButtonModule, ToastModule, ConfirmDialogModule, TooltipModule],
  templateUrl: './getall-prescriptiondetail.html',
  styleUrl: './getall-prescriptiondetail.css',
  encapsulation: ViewEncapsulation.None,
  providers: [ConfirmationService, MessageService]
})
export class GetallPrescriptiondetail implements OnInit {
  details: PrescriptionDetailI[] = [];
  loading = true;

  constructor(
    private detailService: PrescriptionDetailService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.detailService.getAll().subscribe({
      next: (data) => { this.details = data; this.loading = false; },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al cargar los detalles de prescripción' });
        this.loading = false;
      }
    });
  }

  toggleStatus(item: PrescriptionDetailI): void {
    if (!item.id) return;
    const newStatus = item.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    const action = newStatus === 'ACTIVE' ? 'activar' : 'desactivar';
    this.confirmationService.confirm({
      message: `¿Está seguro que desea ${action} este detalle de prescripción?`,
      header: 'Confirmar acción',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí', rejectLabel: 'No',
      accept: () => {
        this.detailService.update(item.id!, { ...item, status: newStatus }).subscribe({
          next: () => {
            item.status = newStatus;
            this.messageService.add({ severity: 'success', summary: 'Éxito', detail: `Detalle ${newStatus === 'ACTIVE' ? 'activado' : 'desactivado'} correctamente` });
          },
          error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: `Error al ${action} el detalle` })
        });
      }
    });
  }
}
