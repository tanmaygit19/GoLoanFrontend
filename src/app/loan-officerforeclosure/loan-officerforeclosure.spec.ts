import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoanOfficerforeclosure } from './loan-officerforeclosure';

describe('LoanOfficerforeclosure', () => {
  let component: LoanOfficerforeclosure;
  let fixture: ComponentFixture<LoanOfficerforeclosure>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoanOfficerforeclosure],
    }).compileComponents();

    fixture = TestBed.createComponent(LoanOfficerforeclosure);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
