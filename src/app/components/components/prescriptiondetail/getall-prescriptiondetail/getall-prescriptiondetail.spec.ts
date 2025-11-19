import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetallPrescriptiondetail } from './getall-prescriptiondetail';

describe('GetallPrescriptiondetail', () => {
  let component: GetallPrescriptiondetail;
  let fixture: ComponentFixture<GetallPrescriptiondetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GetallPrescriptiondetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GetallPrescriptiondetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
