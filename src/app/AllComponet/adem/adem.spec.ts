import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Adem } from './adem';

describe('Adem', () => {
  let component: Adem;
  let fixture: ComponentFixture<Adem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Adem]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Adem);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
