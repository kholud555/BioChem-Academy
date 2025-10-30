import { TestBed } from '@angular/core/testing';

import { AccessControllService } from './access-controll-service';

describe('AccessControllService', () => {
  let service: AccessControllService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AccessControllService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
