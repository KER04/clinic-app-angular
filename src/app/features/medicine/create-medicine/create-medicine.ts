import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { MedicineI } from '../../../core/models/medicine.model';
import { MedicineService } from '../../../core/services/medicine.service';

@Component({
  selector: 'app-create-medicine',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CardModule, InputTextModule, ButtonModule, ToastModule],
  templateUrl: './create-medicine.html',
  styleUrl: './create-medicine.css',
  providers: [MessageService]
})
export class CreateMedicine implements OnInit {
  form!: FormGroup;
  loading = false;

  constructor(private fb: FormBuilder, private service: MedicineService, private messageService: MessageService, private router: Router) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      commercial_name: ['', [Validators.required, Validators.minLength(2)]],
      generic_name: ['', [Validators.required, Validators.minLength(2)]],
      concentration: ['', Validators.required],
      pharmaceutical_form: ['', Validators.required],
      laboratory: ['', Validators.required],
      unit_price: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: 'Complete los campos requeridos' });
      return;
    }
    this.loading = true;
    const data: MedicineI = { ...this.form.value, status: 'ACTIVE' };
    this.service.create(data).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Medicamento registrado correctamente' });
        setTimeout(() => this.router.navigate(['/Medicine']), 1500);
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error?.message || 'Error al registrar el medicamento' });
        this.loading = false;
      }
    });
  }

  isInvalid(f: string): boolean {
    const ctrl = this.form.get(f);
    return !!(ctrl && ctrl.invalid && (ctrl.dirty || ctrl.touched));
  }

  onCancel(): void { this.router.navigate(['/Medicine']); }
}
