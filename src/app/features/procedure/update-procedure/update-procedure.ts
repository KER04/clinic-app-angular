import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageService } from 'primeng/api';
import { ProcedureI } from '../../../core/models/procedure.model';
import { ProcedureService } from '../../../core/services/procedure.service';

@Component({
  selector: 'app-update-procedure',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CardModule, InputTextModule, DatePickerModule, SelectModule, ButtonModule, ToastModule, ProgressSpinnerModule],
  templateUrl: './update-procedure.html',
  styleUrl: './update-procedure.css',
  providers: [MessageService]
})
export class UpdateProcedure implements OnInit {
  form!: FormGroup;
  loading = false;
  loadingData = true;
  itemId!: number;

  statusOptions = [
    { label: 'Activo', value: 'ACTIVE' },
    { label: 'Inactivo', value: 'INACTIVE' }
  ];

  constructor(private fb: FormBuilder, private service: ProcedureService, private messageService: MessageService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      appointment_id: ['', [Validators.required, Validators.min(1)]],
      procedure_code: ['', Validators.required],
      procedure_name: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      cost: ['', Validators.required],
      performed_date: [null, Validators.required],
      status: ['ACTIVE', Validators.required]
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (!id) { this.router.navigate(['/Procedure']); return; }
    this.itemId = Number(id);

    this.service.getById(this.itemId).subscribe({
      next: (item) => {
        this.form.patchValue({ ...item, performed_date: new Date(item.performed_date) });
        this.loadingData = false;
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo cargar el procedimiento' });
        this.loadingData = false;
        setTimeout(() => this.router.navigate(['/Procedure']), 2000);
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: 'Verifique los campos del formulario' });
      return;
    }
    this.loading = true;
    const value = this.form.value;
    const data: ProcedureI = {
      ...value,
      appointment_id: Number(value.appointment_id),
      performed_date: value.performed_date instanceof Date
        ? value.performed_date.toISOString().split('T')[0]
        : value.performed_date
    };
    this.service.update(this.itemId, data).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Procedimiento actualizado correctamente' });
        setTimeout(() => this.router.navigate(['/Procedure']), 1500);
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error?.message || 'Error al actualizar' });
        this.loading = false;
      }
    });
  }

  isInvalid(f: string): boolean {
    const ctrl = this.form.get(f);
    return !!(ctrl && ctrl.invalid && (ctrl.dirty || ctrl.touched));
  }

  onCancel(): void { this.router.navigate(['/Procedure']); }
}
