import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetallDiagnosis } from './getall-diagnosis';

describe('GetallDiagnosis', () => {
  let component: GetallDiagnosis;
  let fixture: ComponentFixture<GetallDiagnosis>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GetallDiagnosis]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GetallDiagnosis);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
