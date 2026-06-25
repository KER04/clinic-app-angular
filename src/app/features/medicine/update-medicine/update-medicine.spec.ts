import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateMedicine } from './update-medicine';

describe('UpdateMedicine', () => {
  let component: UpdateMedicine;
  let fixture: ComponentFixture<UpdateMedicine>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateMedicine]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateMedicine);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
