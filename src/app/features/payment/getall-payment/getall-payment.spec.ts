import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetallPayment } from './getall-payment';

describe('GetallPayment', () => {
  let component: GetallPayment;
  let fixture: ComponentFixture<GetallPayment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GetallPayment]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GetallPayment);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
