import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowFreeMedia } from './show-free-media';

describe('ShowFreeMedia', () => {
  let component: ShowFreeMedia;
  let fixture: ComponentFixture<ShowFreeMedia>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowFreeMedia]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowFreeMedia);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
