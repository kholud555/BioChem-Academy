import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionService } from './question-service';

describe('QuestionService', () => {
  let component: QuestionService;
  let fixture: ComponentFixture<QuestionService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuestionService]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuestionService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
