import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetallPatient } from './getall-patient';

describe('GetallPatient', () => {
  let component: GetallPatient;
  let fixture: ComponentFixture<GetallPatient>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GetallPatient]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GetallPatient);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
