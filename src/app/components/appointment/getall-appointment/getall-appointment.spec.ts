import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetallAppointment } from './getall-appointment';

describe('GetallAppointment', () => {
  let component: GetallAppointment;
  let fixture: ComponentFixture<GetallAppointment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GetallAppointment]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GetallAppointment);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
