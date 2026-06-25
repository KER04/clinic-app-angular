import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetallMedicine } from './getall-medicine';

describe('GetallMedicine', () => {
  let component: GetallMedicine;
  let fixture: ComponentFixture<GetallMedicine>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GetallMedicine]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GetallMedicine);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
