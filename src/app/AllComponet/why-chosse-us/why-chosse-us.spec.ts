import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhyChosseUs } from './why-chosse-us';

describe('WhyChosseUs', () => {
  let component: WhyChosseUs;
  let fixture: ComponentFixture<WhyChosseUs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WhyChosseUs]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WhyChosseUs);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
