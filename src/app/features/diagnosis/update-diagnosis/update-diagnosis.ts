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
import { DiagnosisI } from '../../../core/models/diagnosis.model';
import { DiagnosisService } from '../../../core/services/diagnosis.service';

@Component({
  selector: 'app-update-diagnosis',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CardModule, InputTextModule, DatePickerModule, SelectModule, ButtonModule, ToastModule, ProgressSpinnerModule],
  templateUrl: './update-diagnosis.html',
  styleUrl: './update-diagnosis.css',
  providers: [MessageService]
})
export class UpdateDiagnosis implements OnInit {
  form!: FormGroup;
  loading = false;
  loadingData = true;
  itemId!: number;

  statusOptions = [
    { label: 'Activo', value: 'ACTIVE' },
    { label: 'Inactivo', value: 'INACTIVE' }
  ];

  constructor(private fb: FormBuilder, private service: DiagnosisService, private messageService: MessageService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      patient_id: ['', [Validators.required, Validators.min(1)]],
      appointment_id: ['', [Validators.required, Validators.min(1)]],
      icd10_code: [''],
      description: ['', [Validators.required, Validators.minLength(5)]],
      diagnosis_date: [null, Validators.required],
      observations: [''],
      status: ['ACTIVE', Validators.required]
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (!id) { this.router.navigate(['/Diagnosis']); return; }
    this.itemId = Number(id);

    this.service.getById(this.itemId).subscribe({
      next: (item) => {
        this.form.patchValue({ ...item, diagnosis_date: new Date(item.diagnosis_date) });
        this.loadingData = false;
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo cargar el diagnóstico' });
        this.loadingData = false;
        setTimeout(() => this.router.navigate(['/Diagnosis']), 2000);
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
    const data: DiagnosisI = {
      ...value,
      patient_id: Number(value.patient_id),
      appointment_id: Number(value.appointment_id),
      diagnosis_date: value.diagnosis_date instanceof Date
        ? value.diagnosis_date.toISOString().split('T')[0]
        : value.diagnosis_date
    };
    this.service.update(this.itemId, data).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Diagnóstico actualizado correctamente' });
        setTimeout(() => this.router.navigate(['/Diagnosis']), 1500);
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

  onCancel(): void { this.router.navigate(['/Diagnosis']); }
}
