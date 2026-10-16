import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmiPay } from './emi-pay';

describe('EmiPay', () => {
  let component: EmiPay;
  let fixture: ComponentFixture<EmiPay>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmiPay],
    }).compileComponents();

    fixture = TestBed.createComponent(EmiPay);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
