import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetallProcedure } from './getall-procedure';

describe('GetallProcedure', () => {
  let component: GetallProcedure;
  let fixture: ComponentFixture<GetallProcedure>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GetallProcedure]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GetallProcedure);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
