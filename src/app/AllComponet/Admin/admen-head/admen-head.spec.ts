import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmenHead } from './admen-head';

describe('AdmenHead', () => {
  let component: AdmenHead;
  let fixture: ComponentFixture<AdmenHead>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdmenHead]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdmenHead);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
