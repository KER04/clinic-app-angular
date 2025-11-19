import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateMedicine } from './create-medicine';

describe('CreateMedicine', () => {
  let component: CreateMedicine;
  let fixture: ComponentFixture<CreateMedicine>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateMedicine]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateMedicine);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
