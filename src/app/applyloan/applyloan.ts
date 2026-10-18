import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoanService } from '../loan';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-applyloan',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './applyloan.html',
  styleUrl: './applyloan.scss'
})
export class Applyloan {
  private loan = inject(LoanService);
  private authService = inject(AuthService);

  data: any = {
    customerId: this.authService.getUser()?.customerId || this.authService.getUser()?.userId || 1,
    loanType: 'Personal Loan',
    loanAmount: 250000,
    tenureMonths: 60,
    bankName: '',
    bankAccountNumber: '',
    ifscCode: '',
    emiDay: 10
  };

  message = '';

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
