import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowFreeMediaPart2 } from './show-free-media-part2';

describe('ShowFreeMediaPart2', () => {
  let component: ShowFreeMediaPart2;
  let fixture: ComponentFixture<ShowFreeMediaPart2>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowFreeMediaPart2]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowFreeMediaPart2);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
