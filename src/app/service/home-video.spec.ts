import { TestBed } from '@angular/core/testing';

import { HomeVideo } from './home-video';

describe('HomeVideo', () => {
  let service: HomeVideo;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HomeVideo);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
