import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSpecialty } from './create-specialty';

describe('CreateSpecialty', () => {
  let component: CreateSpecialty;
  let fixture: ComponentFixture<CreateSpecialty>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateSpecialty]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateSpecialty);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
