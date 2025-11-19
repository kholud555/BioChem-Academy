import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainHomeExam } from './main-home-exam';

describe('MainHomeExam', () => {
  let component: MainHomeExam;
  let fixture: ComponentFixture<MainHomeExam>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainHomeExam]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainHomeExam);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
