import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeGrades } from './home-grades';

describe('HomeGrades', () => {
  let component: HomeGrades;
  let fixture: ComponentFixture<HomeGrades>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeGrades]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeGrades);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
