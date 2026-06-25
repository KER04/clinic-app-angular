import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatePrescriptiondetail } from './update-prescriptiondetail';

describe('UpdatePrescriptiondetail', () => {
  let component: UpdatePrescriptiondetail;
  let fixture: ComponentFixture<UpdatePrescriptiondetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdatePrescriptiondetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdatePrescriptiondetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
