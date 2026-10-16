import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoanaccountDetails } from './loanaccount-details';

describe('LoanaccountDetails', () => {
  let component: LoanaccountDetails;
  let fixture: ComponentFixture<LoanaccountDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoanaccountDetails],
    }).compileComponents();

    fixture = TestBed.createComponent(LoanaccountDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
