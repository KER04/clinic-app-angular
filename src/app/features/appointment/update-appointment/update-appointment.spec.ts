import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateAppointment } from './update-appointment';

describe('UpdateAppointment', () => {
  let component: UpdateAppointment;
  let fixture: ComponentFixture<UpdateAppointment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateAppointment]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateAppointment);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
