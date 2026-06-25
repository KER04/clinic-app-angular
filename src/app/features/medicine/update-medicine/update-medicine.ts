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
import { MedicineI } from '../../../core/models/medicine.model';
import { MedicineService } from '../../../core/services/medicine.service';

@Component({
  selector: 'app-update-medicine',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CardModule, InputTextModule, SelectModule, ButtonModule, ToastModule, ProgressSpinnerModule],
  templateUrl: './update-medicine.html',
  styleUrl: './update-medicine.css',
  providers: [MessageService]
})
export class UpdateMedicine implements OnInit {
  form!: FormGroup;
  loading = false;
  loadingData = true;
  itemId!: number;

  statusOptions = [
    { label: 'Activo', value: 'ACTIVE' },
    { label: 'Inactivo', value: 'INACTIVE' }
  ];

  constructor(private fb: FormBuilder, private service: MedicineService, private messageService: MessageService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      commercial_name: ['', [Validators.required, Validators.minLength(2)]],
      generic_name: ['', [Validators.required, Validators.minLength(2)]],
      concentration: ['', Validators.required],
      pharmaceutical_form: ['', Validators.required],
      laboratory: ['', Validators.required],
      unit_price: ['', Validators.required],
      status: ['ACTIVE', Validators.required]
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (!id) { this.router.navigate(['/Medicine']); return; }
    this.itemId = Number(id);

    this.service.getById(this.itemId).subscribe({
      next: (item) => { this.form.patchValue(item); this.loadingData = false; },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo cargar el medicamento' });
        this.loadingData = false;
        setTimeout(() => this.router.navigate(['/Medicine']), 2000);
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
    this.service.update(this.itemId, this.form.value).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Medicamento actualizado correctamente' });
        setTimeout(() => this.router.navigate(['/Medicine']), 1500);
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

  onCancel(): void { this.router.navigate(['/Medicine']); }
}
