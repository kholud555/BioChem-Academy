import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FixedIcon } from './fixed-icon';

describe('FixedIcon', () => {
  let component: FixedIcon;
  let fixture: ComponentFixture<FixedIcon>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FixedIcon]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FixedIcon);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
