import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoanOfficerClosure } from './loan-officer-closure';

describe('LoanOfficerClosure', () => {
  let component: LoanOfficerClosure;
  let fixture: ComponentFixture<LoanOfficerClosure>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoanOfficerClosure],
    }).compileComponents();

    fixture = TestBed.createComponent(LoanOfficerClosure);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
