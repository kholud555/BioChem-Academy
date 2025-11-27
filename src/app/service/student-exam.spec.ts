import { TestBed } from '@angular/core/testing';

import { StudentExamService} from './student-exam';

describe('StudentExam', () => {
  let service: StudentExamService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StudentExamService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
