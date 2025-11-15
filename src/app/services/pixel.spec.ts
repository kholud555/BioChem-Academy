import { TestBed } from '@angular/core/testing';

import { Pixel } from './pixel';

describe('Pixel', () => {
  let service: Pixel;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Pixel);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
