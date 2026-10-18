
import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Eligibilityservice } from '../services/eligibility';

@Component({
  selector: 'app-eligibility',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './eligibility.html',
  styleUrl: './eligibility.scss'
})
export class Eligibility {

  customerId: number = 1;

  eligibility: any = null;
  showResult: boolean = false;

  requestedLoanAmount: number = 500000;
  loanTenureMonths: number = 60;
  interestRate: number = 11;
  emi: number = 0;

  message: string = '';

  constructor(
    private eligibilityservice: Eligibilityservice,
    private cdr: ChangeDetectorRef
  ) {}

  // Check the customer's latest eligibility and application
  getEligibility() {
    this.message = '';
    this.eligibility = null;
    this.showResult = false;

    this.eligibilityservice.getEligibility(this.customerId).subscribe({
      next: (res: any) => {
        this.eligibility = res;

        // An application has already been submitted
        if (
          res.requestedLoanAmount > 0 &&
          res.loanTenureMonths > 0
        ) {
          this.requestedLoanAmount = res.requestedLoanAmount;
          this.loanTenureMonths = res.loanTenureMonths;
          this.interestRate = res.interestRate;

          this.calculateEMI();

          // Show the latest application status
          this.showResult = true;
        } else {
          // No submitted application: show the loan form
          this.requestedLoanAmount = 500000;
          this.loanTenureMonths = 60;

          this.changeTenure();
          this.showResult = false;
        }

        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error(err);

        this.eligibility = null;
        this.showResult = false;
        this.message = 'Unable to load eligibility details.';

        this.cdr.detectChanges();
      }
    });
  }

  // Change interest rate based on tenure
  changeTenure() {
    this.interestRate =
      this.loanTenureMonths === 36 ? 11.5 : 11;

    this.calculateEMI();
  }

  // Calculate monthly EMI
  calculateEMI() {
    if (
      this.requestedLoanAmount <= 0 ||
      this.loanTenureMonths <= 0
    ) {
      this.emi = 0;
      return;
    }

    const monthlyRate = this.interestRate / 1200;
    const months = this.loanTenureMonths;
    const factor = Math.pow(1 + monthlyRate, months);

    this.emi = Math.round(
      this.requestedLoanAmount *
      monthlyRate *
      factor /
      (factor - 1)
    );
  }

  // Submit a loan application
  applyForLoan() {
    if (!this.eligibility) {
      this.message = 'Please check eligibility first.';
      return;
    }

    if (
      this.requestedLoanAmount <= 0 ||
      this.requestedLoanAmount > this.eligibility.loanAmount
    ) {
      this.message =
        'Enter an amount within your eligible loan limit.';
      return;
    }

    this.message = '';

    this.eligibilityservice.applyForLoan(
      this.customerId,
      this.requestedLoanAmount,
      this.loanTenureMonths
    ).subscribe({
      next: (res: any) => {
        // Store the application response
        this.eligibility = res;

        this.requestedLoanAmount = res.requestedLoanAmount;
        this.loanTenureMonths = res.loanTenureMonths;
        this.interestRate = res.interestRate;

        this.calculateEMI();

        // Display the result screen
        this.showResult = true;
        this.message = '';

        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error(err);

        this.message = 'Unable to submit loan application.';
        this.cdr.detectChanges();
      }
    });
  }

  // Return to the loan form
  backToForm() {
    this.showResult = false;
    this.message = '';
  }
}
