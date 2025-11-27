import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoForTeacher } from './video-for-teacher';

describe('VideoForTeacher', () => {
  let component: VideoForTeacher;
  let fixture: ComponentFixture<VideoForTeacher>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VideoForTeacher]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VideoForTeacher);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
