
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Loanservice } from '../loanservice';
import { Notification } from '../notification/notification';

@Component({
  imports: [CommonModule,Notification],
  selector: 'app-emischedule',
  styleUrl: './emischedule.scss',
  templateUrl: './emischedule.html',
})
export class Emischedule {

  emis: any[] = [];
  accounts: any[] = [];
  selectedLoanId: number | null = null;

  totalEmis = 0;
  paidEmis = 0;
  pendingEmis = 0;
  outstandingBalance = 0;

  constructor(private service: Loanservice) {

   
    this.service.getAccounts().subscribe({
      next: (res: any) => {
        this.accounts = res;

        if (this.accounts.length > 0) {
          this.selectedLoanId = this.accounts[0].loanAccountId;
        if (this.selectedLoanId !== null) {
       this.loadEmiSchedule(this.selectedLoanId);
        }
        }
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

 
  loadEmiSchedule(loanId: number) {
    this.service.getEmiSchedule(loanId).subscribe({
      next: (res: any[]) => {

        this.emis = res;

        this.totalEmis = res.length;

        this.paidEmis = res.filter(
          (e: any) => e.paymentStatus === 'Paid'
        ).length;

        this.pendingEmis = res.filter(
          (e: any) => e.paymentStatus === 'Pending'
        ).length;

        this.service.getLoanAccount(loanId).subscribe({
  next: (account: any) => {
    this.outstandingBalance = account.outstandingPrincipal;
  },
  error: (err) => {
    console.log('Error fetching loan account:', err);
  }
});

        console.log(res);
      },
      error: (err) => {
        console.log(err);
      }
    });
    
  }
  isCurrentMonthEmi(emi: any): boolean {
  const dueDate = new Date(emi.dueDate);
  const today = new Date();

  return (
    dueDate.getMonth() === today.getMonth() &&
    dueDate.getFullYear() === today.getFullYear()
  );
}
}
