import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoanScorecard } from './loan-scorecard';

describe('LoanScorecard', () => {
  let component: LoanScorecard;
  let fixture: ComponentFixture<LoanScorecard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoanScorecard],
    }).compileComponents();

    fixture = TestBed.createComponent(LoanScorecard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
