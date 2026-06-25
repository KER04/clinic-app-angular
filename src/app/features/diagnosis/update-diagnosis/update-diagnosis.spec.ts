import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateDiagnosis } from './update-diagnosis';

describe('UpdateDiagnosis', () => {
  let component: UpdateDiagnosis;
  let fixture: ComponentFixture<UpdateDiagnosis>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateDiagnosis]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateDiagnosis);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
