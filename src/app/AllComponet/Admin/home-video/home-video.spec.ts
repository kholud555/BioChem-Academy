import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeVideo } from './home-video';

describe('HomeVideo', () => {
  let component: HomeVideo;
  let fixture: ComponentFixture<HomeVideo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeVideo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeVideo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
