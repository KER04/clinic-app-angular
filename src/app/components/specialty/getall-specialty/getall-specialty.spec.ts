import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetallSpecialty } from './getall-specialty';

describe('GetallSpecialty', () => {
  let component: GetallSpecialty;
  let fixture: ComponentFixture<GetallSpecialty>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GetallSpecialty]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GetallSpecialty);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
