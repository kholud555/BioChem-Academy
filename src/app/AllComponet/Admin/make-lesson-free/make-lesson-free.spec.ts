import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MakeLessonFree } from './make-lesson-free';

describe('MakeLessonFree', () => {
  let component: MakeLessonFree;
  let fixture: ComponentFixture<MakeLessonFree>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MakeLessonFree]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MakeLessonFree);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
