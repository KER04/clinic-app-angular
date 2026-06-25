import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePrescriptiondetail } from './create-prescriptiondetail';

describe('CreatePrescriptiondetail', () => {
  let component: CreatePrescriptiondetail;
  let fixture: ComponentFixture<CreatePrescriptiondetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreatePrescriptiondetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreatePrescriptiondetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
