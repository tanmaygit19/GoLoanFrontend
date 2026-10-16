import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Foreclosure } from './foreclosure';

describe('Foreclosure', () => {
  let component: Foreclosure;
  let fixture: ComponentFixture<Foreclosure>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Foreclosure],
    }).compileComponents();

    fixture = TestBed.createComponent(Foreclosure);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
