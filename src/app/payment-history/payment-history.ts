import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaymentHistoryService } from '../payment-history-service';

@Component({
  imports: [CommonModule, FormsModule],
  selector: 'app-payment-history',
  styleUrl: './payment-history.scss',
  templateUrl: './payment-history.html',
})
export class PaymentHistory {

  payments: any;
  foreClosurePayments: any;
  loanAccounts: any;

  loanAccount: number | null = null;
  period = 'all';

  constructor(private service: PaymentHistoryService, private cd: ChangeDetectorRef)
   {
    this.getLoanAccounts();
    this.getPaymentHistory();
    this.getForeClosurePaymentHistory();
  }

  getLoanAccounts() {
    this.service.getLoanAccounts().subscribe({
      next: res => {
        this.loanAccounts = res;
        this.cd.detectChanges();
      },
      error: err => {
        console.log(err)
      }
    });
  }

  getPaymentHistory() {
    this.service.getEmiPaymentHistory(this.loanAccount, this.period).subscribe({
      next: res => {
        this.payments = res;
        this.cd.detectChanges();
      },
      error: err => 
        {
        console.log(err)
        }
    });
  }

  getForeClosurePaymentHistory() {
    this.service.getForeClosurePaymentHistory(this.loanAccount, this.period).subscribe({
      next: res => {
        this.foreClosurePayments = res;
        this.cd.detectChanges();
      },
      error: err =>
        {
          console.log(err)
        } 
    });
  }
}