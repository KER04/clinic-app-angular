import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmationService, MessageService } from 'primeng/api';
import { PaymentI } from '../../../core/models/payment.model';
import { PaymentService } from '../../../core/services/payment.service';

@Component({
  selector: 'app-getall-payment',
  standalone: true,
  imports: [CommonModule, RouterModule, TableModule, ButtonModule, ToastModule, ConfirmDialogModule, TooltipModule],
  templateUrl: './getall-payment.html',
  styleUrl: './getall-payment.css',
  encapsulation: ViewEncapsulation.None,
  providers: [ConfirmationService, MessageService]
})
export class GetallPayment implements OnInit {
  payments: PaymentI[] = [];
  loading = true;

  constructor(
    private paymentService: PaymentService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.paymentService.getAll().subscribe({
      next: (data) => { this.payments = data; this.loading = false; },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al cargar los pagos' });
        this.loading = false;
      }
    });
  }

  toggleStatus(item: PaymentI): void {
    if (!item.id) return;
    const newStatus = item.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    const action = newStatus === 'ACTIVE' ? 'activar' : 'desactivar';
    this.confirmationService.confirm({
      message: `¿Está seguro que desea ${action} el pago ${item.invoice_number || item.id}?`,
      header: 'Confirmar acción',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí', rejectLabel: 'No',
      accept: () => {
        this.paymentService.update(item.id!, { ...item, status: newStatus }).subscribe({
          next: () => {
            item.status = newStatus;
            this.messageService.add({ severity: 'success', summary: 'Éxito', detail: `Pago ${newStatus === 'ACTIVE' ? 'activado' : 'desactivado'} correctamente` });
          },
          error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: `Error al ${action} el pago` })
        });
      }
    });
  }

  getPaymentStatusClass(status: string): string {
    switch (status) {
      case 'PAGADO': return 'bg-green-100 text-green-800';
      case 'PENDIENTE': return 'bg-yellow-100 text-yellow-800';
      case 'CANCELADO': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }
}
