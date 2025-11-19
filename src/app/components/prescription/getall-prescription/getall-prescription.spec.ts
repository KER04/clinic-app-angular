import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetallPrescription } from './getall-prescription';

describe('GetallPrescription', () => {
  let component: GetallPrescription;
  let fixture: ComponentFixture<GetallPrescription>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GetallPrescription]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GetallPrescription);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
