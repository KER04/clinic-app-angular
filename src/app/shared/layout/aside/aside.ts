import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { PanelMenu } from 'primeng/panelmenu';

@Component({
  selector: 'app-aside',
  standalone: true,
  imports: [PanelMenu],
  templateUrl: './aside.html',
  styleUrl: './aside.css'
})export class Aside {
  items: MenuItem[] | undefined;

  ngOnInit() {
    this.items = [

      // ============================
      // 🩺 ÁREA CLÍNICA
      // ============================
      {
        label: 'Área Clínica',
        icon: 'pi pi-fw pi-heart-fill',
        items: [

          // Pacientes
          {
            label: 'Pacientes',
            icon: 'pi pi-fw pi-users',
            items: [
              { label: 'Listado', icon: 'pi pi-list', routerLink: ['/Patient'] },
              { label: 'Nuevo', icon: 'pi pi-user-plus', routerLink: ['/Patient/Create'] },
            ],
          },

          // Doctores
          {
            label: 'Doctores',
            icon: 'pi pi-fw pi-user-edit',
            items: [
              { label: 'Listado', icon: 'pi pi-list', routerLink: ['/Doctor'] },
              { label: 'Nuevo', icon: 'pi pi-plus-circle', routerLink: ['/Doctor/Create'] },
            ],
          },

          // Diagnósticos
          {
            label: 'Diagnósticos',
            icon: 'pi pi-fw pi-notes-medical',   // ícono adecuado
            items: [
              { label: 'Listado', icon: 'pi pi-list', routerLink: ['/Diagnosis'] },
              { label: 'Nuevo', icon: 'pi pi-plus-circle', routerLink: ['/Diagnosis/Create'] },
            ],
          },

          // Medicamentos
          {
            label: 'Medicamentos',
            icon: 'pi pi-fw pi-prescription',   // ícono médico mejorado
            items: [
              { label: 'Listado', icon: 'pi pi-list', routerLink: ['/Medicine'] },
              { label: 'Nuevo', icon: 'pi pi-plus-circle', routerLink: ['/Medicine/Create'] },
            ],
          },

          // Prescripciones
          {
            label: 'Prescripciones',
            icon: 'pi pi-fw pi-file-edit',
            items: [
              { label: 'Listado', icon: 'pi pi-list', routerLink: ['/Prescription'] },
              { label: 'Nueva', icon: 'pi pi-plus-circle', routerLink: ['/Prescription/Create'] },

              // Detalle de Prescripción
              {
                label: 'Detalles',
                icon: 'pi pi-file',
                items: [
                  { label: 'Listado', icon: 'pi pi-list', routerLink: ['/PrescriptionDetail'] },
                  { label: 'Nuevo', icon: 'pi pi-plus-circle', routerLink: ['/PrescriptionDetail/Create'] },
                ],
              },
            ],
          },
          {
            label: 'Especialidades',
            icon: 'pi pi-fw pi-briefcase',
            items: [
              { label: 'Listado', icon: 'pi pi-list', routerLink: ['/Specialty'] },
              { label: 'Nueva', icon: 'pi pi-plus-circle', routerLink: ['/Specialty/Create'] },
            ],
          }
        ],
      },

      // ============================
      // 📅 OPERATIVO / ADMINISTRATIVO
      // ============================
      {
        label: 'Administrativo',
        icon: 'pi pi-fw pi-briefcase',
        items: [

          // Citas
          {
            label: 'Citas',
            icon: 'pi pi-fw pi-calendar',
            items: [
              { label: 'Listado', icon: 'pi pi-list', routerLink: ['/Appointment'] },
              { label: 'Nueva', icon: 'pi pi-calendar-plus', routerLink: ['/Appointment/Create'] },
            ],
          },

          // Procedimientos
          {
            label: 'Procedimientos',
            icon: 'pi pi-fw pi-cog',
            items: [
              { label: 'Listado', icon: 'pi pi-list', routerLink: ['/Procedure'] },
              { label: 'Nuevo', icon: 'pi pi-plus-circle', routerLink: ['/Procedure/Create'] },
            ],
          },

          // Pagos
          {
            label: 'Pagos',
            icon: 'pi pi-fw pi-wallet',
            items: [
              { label: 'Listado', icon: 'pi pi-list', routerLink: ['/Payment'] },
              { label: 'Nuevo', icon: 'pi pi-plus-circle', routerLink: ['/Payment/Create'] },
            ],
          },
        ],
      },
    ];
  }
}
