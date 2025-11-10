import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowLessonMedia } from './show-lesson-media';

describe('ShowLessonMedia', () => {
  let component: ShowLessonMedia;
  let fixture: ComponentFixture<ShowLessonMedia>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowLessonMedia]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowLessonMedia);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
