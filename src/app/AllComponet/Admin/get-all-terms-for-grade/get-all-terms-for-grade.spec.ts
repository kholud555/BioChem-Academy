import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetAllTermsForGrade } from './get-all-terms-for-grade';

describe('GetAllTermsForGrade', () => {
  let component: GetAllTermsForGrade;
  let fixture: ComponentFixture<GetAllTermsForGrade>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GetAllTermsForGrade]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GetAllTermsForGrade);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
