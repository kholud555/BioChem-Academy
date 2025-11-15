import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowService } from './show-service';

describe('ShowService', () => {
  let component: ShowService;
  let fixture: ComponentFixture<ShowService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowService]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
