import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageService } from 'primeng/api';
import { PrescriptionDetailI } from '../../../core/models/prescriptiondetail.model';
import { PrescriptionDetailService } from '../../../core/services/prescriptiondetail.service';

@Component({
  selector: 'app-update-prescriptiondetail',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CardModule, InputTextModule, SelectModule, ButtonModule, ToastModule, ProgressSpinnerModule],
  templateUrl: './update-prescriptiondetail.html',
  styleUrl: './update-prescriptiondetail.css',
  providers: [MessageService]
})
export class UpdatePrescriptiondetail implements OnInit {
  form!: FormGroup;
  loading = false;
  loadingData = true;
  itemId!: number;

  statusOptions = [
    { label: 'Activo', value: 'ACTIVE' },
    { label: 'Inactivo', value: 'INACTIVE' }
  ];

  constructor(private fb: FormBuilder, private service: PrescriptionDetailService, private messageService: MessageService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      prescription_id: ['', [Validators.required, Validators.min(1)]],
      medicine_id: ['', [Validators.required, Validators.min(1)]],
      quantity: ['', [Validators.required, Validators.min(1)]],
      dosage: ['', Validators.required],
      treatment_days: ['', [Validators.required, Validators.min(1)]],
      special_instructions: [''],
      status: ['ACTIVE', Validators.required]
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (!id) { this.router.navigate(['/PrescriptionDetail']); return; }
    this.itemId = Number(id);

    this.service.getById(this.itemId).subscribe({
      next: (item) => { this.form.patchValue(item); this.loadingData = false; },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo cargar el detalle' });
        this.loadingData = false;
        setTimeout(() => this.router.navigate(['/PrescriptionDetail']), 2000);
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
    const data: PrescriptionDetailI = {
      ...value,
      prescription_id: Number(value.prescription_id),
      medicine_id: Number(value.medicine_id),
      quantity: Number(value.quantity),
      treatment_days: Number(value.treatment_days)
    };
    this.service.update(this.itemId, data).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Detalle actualizado correctamente' });
        setTimeout(() => this.router.navigate(['/PrescriptionDetail']), 1500);
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

  onCancel(): void { this.router.navigate(['/PrescriptionDetail']); }
}
