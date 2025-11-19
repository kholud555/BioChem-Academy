import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseLessonMedia } from './course-lesson-media';

describe('CourseLessonMedia', () => {
  let component: CourseLessonMedia;
  let fixture: ComponentFixture<CourseLessonMedia>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourseLessonMedia]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CourseLessonMedia);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
