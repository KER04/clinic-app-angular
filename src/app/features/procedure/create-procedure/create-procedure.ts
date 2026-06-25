import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { DatePickerModule } from 'primeng/datepicker';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ProcedureI } from '../../../core/models/procedure.model';
import { ProcedureService } from '../../../core/services/procedure.service';

@Component({
  selector: 'app-create-procedure',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CardModule, InputTextModule, DatePickerModule, ButtonModule, ToastModule],
  templateUrl: './create-procedure.html',
  styleUrl: './create-procedure.css',
  providers: [MessageService]
})
export class CreateProcedure implements OnInit {
  form!: FormGroup;
  loading = false;

  constructor(private fb: FormBuilder, private service: ProcedureService, private messageService: MessageService, private router: Router) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      appointment_id: ['', [Validators.required, Validators.min(1)]],
      procedure_code: ['', Validators.required],
      procedure_name: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      cost: ['', Validators.required],
      performed_date: ['', Validators.required]
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
    const data: ProcedureI = {
      ...value,
      appointment_id: Number(value.appointment_id),
      performed_date: value.performed_date instanceof Date
        ? value.performed_date.toISOString().split('T')[0]
        : value.performed_date,
      status: 'ACTIVE'
    };
    this.service.create(data).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Procedimiento registrado correctamente' });
        setTimeout(() => this.router.navigate(['/Procedure']), 1500);
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error?.message || 'Error al registrar el procedimiento' });
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
