import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ProcedureI } from '../../../core/models/procedure.model';
import { ProcedureService } from '../../../core/services/procedure.service';

@Component({
  selector: 'app-getall-procedure',
  standalone: true,
  imports: [CommonModule, RouterModule, TableModule, ButtonModule, ToastModule, ConfirmDialogModule, TooltipModule],
  templateUrl: './getall-procedure.html',
  styleUrl: './getall-procedure.css',
  encapsulation: ViewEncapsulation.None,
  providers: [ConfirmationService, MessageService]
})
export class GetallProcedure implements OnInit {
  procedures: ProcedureI[] = [];
  loading = true;

  constructor(
    private procedureService: ProcedureService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.procedureService.getAll().subscribe({
      next: (data) => { this.procedures = data; this.loading = false; },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al cargar los procedimientos' });
        this.loading = false;
      }
    });
  }

  toggleStatus(item: ProcedureI): void {
    if (!item.id) return;
    const newStatus = item.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    const action = newStatus === 'ACTIVE' ? 'activar' : 'desactivar';
    this.confirmationService.confirm({
      message: `¿Está seguro que desea ${action} el procedimiento ${item.procedure_name}?`,
      header: 'Confirmar acción',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí', rejectLabel: 'No',
      accept: () => {
        this.procedureService.update(item.id!, { ...item, status: newStatus }).subscribe({
          next: () => {
            item.status = newStatus;
            this.messageService.add({ severity: 'success', summary: 'Éxito', detail: `Procedimiento ${newStatus === 'ACTIVE' ? 'activado' : 'desactivado'} correctamente` });
          },
          error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: `Error al ${action} el procedimiento` })
        });
      }
    });
  }
}
