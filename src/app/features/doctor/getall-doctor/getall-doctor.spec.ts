import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetallDoctor } from './getall-doctor';

describe('GetallDoctor', () => {
  let component: GetallDoctor;
  let fixture: ComponentFixture<GetallDoctor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GetallDoctor]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GetallDoctor);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
