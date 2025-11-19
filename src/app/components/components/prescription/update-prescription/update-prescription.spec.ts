import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatePrescription } from './update-prescription';

describe('UpdatePrescription', () => {
  let component: UpdatePrescription;
  let fixture: ComponentFixture<UpdatePrescription>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdatePrescription]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdatePrescription);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
