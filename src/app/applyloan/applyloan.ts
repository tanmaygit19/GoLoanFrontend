
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoanService } from '../loan';

@Component({
  selector: 'app-applyloan',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './applyloan.html',
  styleUrl: './applyloan.scss'
})
export class Applyloan {
  data: any = {
    customerId: 26,
    loanType: 'Personal Loan',
    loanAmount: 250000,
    tenureMonths: 60,
    bankName: '',
    bankAccountNumber: '',
    ifscCode: '',
    emiDay: 10
  };

  message = '';

  constructor(private loan: LoanService) {}

  addloan() {
    this.loan.addloan(this.data).subscribe({
      next: () => {
        this.message = 'Loan application submitted successfully';
      },
      error: (error) => {
        this.message = error.error?.message || 'Unable to submit loan application';
      }
    });
  }
}
