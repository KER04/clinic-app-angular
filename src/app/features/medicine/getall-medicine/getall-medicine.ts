import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmationService, MessageService } from 'primeng/api';
import { MedicineI } from '../../../core/models/medicine.model';
import { MedicineService } from '../../../core/services/medicine.service';

@Component({
  selector: 'app-getall-medicine',
  standalone: true,
  imports: [CommonModule, RouterModule, TableModule, ButtonModule, ToastModule, ConfirmDialogModule, TooltipModule],
  templateUrl: './getall-medicine.html',
  styleUrl: './getall-medicine.css',
  encapsulation: ViewEncapsulation.None,
  providers: [ConfirmationService, MessageService]
})
export class GetallMedicine implements OnInit {
  medicines: MedicineI[] = [];
  loading = true;

  constructor(
    private medicineService: MedicineService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.medicineService.getAll().subscribe({
      next: (data) => { this.medicines = data; this.loading = false; },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al cargar los medicamentos' });
        this.loading = false;
      }
    });
  }

  toggleStatus(item: MedicineI): void {
    if (!item.id) return;
    const newStatus = item.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    const action = newStatus === 'ACTIVE' ? 'activar' : 'desactivar';
    this.confirmationService.confirm({
      message: `¿Está seguro que desea ${action} el medicamento ${item.commercial_name}?`,
      header: 'Confirmar acción',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí', rejectLabel: 'No',
      accept: () => {
        this.medicineService.update(item.id!, { ...item, status: newStatus }).subscribe({
          next: () => {
            item.status = newStatus;
            this.messageService.add({ severity: 'success', summary: 'Éxito', detail: `Medicamento ${newStatus === 'ACTIVE' ? 'activado' : 'desactivado'} correctamente` });
          },
          error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: `Error al ${action} el medicamento` })
        });
      }
    });
  }
}
