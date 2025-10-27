import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetllStudents } from './getll-students';

describe('GetllStudents', () => {
  let component: GetllStudents;
  let fixture: ComponentFixture<GetllStudents>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GetllStudents]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GetllStudents);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
