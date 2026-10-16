import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ForeclosurePayment } from './foreclosure-payment';

describe('ForeclosurePayment', () => {
  let component: ForeclosurePayment;
  let fixture: ComponentFixture<ForeclosurePayment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForeclosurePayment],
    }).compileComponents();

    fixture = TestBed.createComponent(ForeclosurePayment);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
