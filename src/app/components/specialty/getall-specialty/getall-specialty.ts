import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { SpecialtyI } from '../../../models/specialty.model';
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';
import { specialtyService } from '../../../services/specialty.service';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-getall-specialty',
  imports: [TableModule, CommonModule, ButtonModule, RouterModule, ConfirmDialogModule, ToastModule, TooltipModule], 
  templateUrl: './getall-specialty.html',
  styleUrl: './getall-specialty.css',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  providers: [ConfirmationService, MessageService]
})


export class GetallSpecialty implements OnInit {
  specialties: SpecialtyI[] = [];
  loading: boolean = true;

  constructor(
    private specialtyService: specialtyService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.loadSpecialties();
  }

  loadSpecialties(): void {
    this.loading = true;
    this.specialtyService.getAllSpecialty().subscribe({
      next: (specialties) => {
        this.specialties = specialties;
        this.specialtyService.updateLocalSpecialty(specialties);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading specialties:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar las especialidades'
        });
        this.loading = false;
      }
    });
  }


  toggleStatus(specialty: SpecialtyI): void {
    const newStatus = specialty.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    const action = newStatus === 'INACTIVE' ? 'desactivar' : 'activar';

    this.confirmationService.confirm({
      message: `¿Está seguro que desea ${action} la especialidad "${specialty.specialty_name}"?`,
      header: 'Confirmar acción',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      accept: () => {
        const updatedSpecialty: SpecialtyI = {
          ...specialty,
          status: newStatus
        };

        this.specialtyService.updateSpecialty(specialty.id!.toString(), updatedSpecialty).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: `Especialidad ${action}da correctamente`
            });
            this.loadSpecialties();
          },
          error: (error) => {
            console.error('Error al cambiar estado:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: `Error al ${action} la especialidad`
            });
          }
        });
      }
    });
  }

}

