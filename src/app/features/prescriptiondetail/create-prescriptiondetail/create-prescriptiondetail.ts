import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { PrescriptionDetailI } from '../../../core/models/prescriptiondetail.model';
import { PrescriptionDetailService } from '../../../core/services/prescriptiondetail.service';

@Component({
  selector: 'app-create-prescriptiondetail',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CardModule, InputTextModule, ButtonModule, ToastModule],
  templateUrl: './create-prescriptiondetail.html',
  styleUrl: './create-prescriptiondetail.css',
  providers: [MessageService]
})
export class CreatePrescriptiondetail implements OnInit {
  form!: FormGroup;
  loading = false;

  constructor(private fb: FormBuilder, private service: PrescriptionDetailService, private messageService: MessageService, private router: Router) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      prescription_id: ['', [Validators.required, Validators.min(1)]],
      medicine_id: ['', [Validators.required, Validators.min(1)]],
      quantity: ['', [Validators.required, Validators.min(1)]],
      dosage: ['', Validators.required],
      treatment_days: ['', [Validators.required, Validators.min(1)]],
      special_instructions: ['']
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: 'Complete los campos requeridos' });
      return;
    }
    this.loading = true;
    const value = this.form.value;
    const data: PrescriptionDetailI = {
      ...value,
      prescription_id: Number(value.prescription_id),
      medicine_id: Number(value.medicine_id),
      quantity: Number(value.quantity),
      treatment_days: Number(value.treatment_days),
      status: 'ACTIVE'
    };
    this.service.create(data).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Detalle registrado correctamente' });
        setTimeout(() => this.router.navigate(['/PrescriptionDetail']), 1500);
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error?.message || 'Error al registrar el detalle' });
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
