import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateDiagnosis } from './create-diagnosis';

describe('CreateDiagnosis', () => {
  let component: CreateDiagnosis;
  let fixture: ComponentFixture<CreateDiagnosis>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateDiagnosis]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateDiagnosis);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
