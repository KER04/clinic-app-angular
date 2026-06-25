import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateProcedure } from './create-procedure';

describe('CreateProcedure', () => {
  let component: CreateProcedure;
  let fixture: ComponentFixture<CreateProcedure>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateProcedure]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateProcedure);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
