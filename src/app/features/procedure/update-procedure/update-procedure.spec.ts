import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateProcedure } from './update-procedure';

describe('UpdateProcedure', () => {
  let component: UpdateProcedure;
  let fixture: ComponentFixture<UpdateProcedure>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateProcedure]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateProcedure);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
