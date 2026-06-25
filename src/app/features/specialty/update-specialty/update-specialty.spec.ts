import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateSpecialty } from './update-specialty';

describe('UpdateSpecialty', () => {
  let component: UpdateSpecialty;
  let fixture: ComponentFixture<UpdateSpecialty>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateSpecialty]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateSpecialty);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
