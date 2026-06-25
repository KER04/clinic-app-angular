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
import { PrescriptionI } from '../../../core/models/prescription.model';
import { PrescriptionService } from '../../../core/services/prescription.service';

@Component({
  selector: 'app-update-prescription',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CardModule, InputTextModule, DatePickerModule, SelectModule, ButtonModule, ToastModule, ProgressSpinnerModule],
  templateUrl: './update-prescription.html',
  styleUrl: './update-prescription.css',
  providers: [MessageService]
})
export class UpdatePrescription implements OnInit {
  form!: FormGroup;
  loading = false;
  loadingData = true;
  itemId!: number;

  statusOptions = [
    { label: 'Activa', value: 'ACTIVE' },
    { label: 'Inactiva', value: 'INACTIVE' }
  ];

  constructor(private fb: FormBuilder, private service: PrescriptionService, private messageService: MessageService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      appointment_id: ['', [Validators.required, Validators.min(1)]],
      doctor_id: ['', [Validators.required, Validators.min(1)]],
      issue_date: [null, Validators.required],
      general_instructions: [''],
      status: ['ACTIVE', Validators.required]
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (!id) { this.router.navigate(['/Prescription']); return; }
    this.itemId = Number(id);

    this.service.getById(this.itemId).subscribe({
      next: (item) => {
        this.form.patchValue({ ...item, issue_date: new Date(item.issue_date) });
        this.loadingData = false;
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo cargar la prescripción' });
        this.loadingData = false;
        setTimeout(() => this.router.navigate(['/Prescription']), 2000);
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
    const data: PrescriptionI = {
      ...value,
      appointment_id: Number(value.appointment_id),
      doctor_id: Number(value.doctor_id),
      issue_date: value.issue_date instanceof Date
        ? value.issue_date.toISOString().split('T')[0]
        : value.issue_date
    };
    this.service.update(this.itemId, data).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Prescripción actualizada correctamente' });
        setTimeout(() => this.router.navigate(['/Prescription']), 1500);
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

  onCancel(): void { this.router.navigate(['/Prescription']); }
}
