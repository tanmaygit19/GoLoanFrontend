import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Loanservice } from '../loanservice';
import { AuthService } from '../core/services/auth.service';
import { Notification } from '../notification/notification';
import { Paybtn } from '../paybtn/paybtn';

@Component({
  imports: [CommonModule, FormsModule, Notification, Paybtn],
  selector: 'app-emischedule',
  styleUrl: './emischedule.scss',
  templateUrl: './emischedule.html',
})
export class Emischedule implements OnInit {
  emis: any[] = [];
  accounts: any[] = [];
  selectedLoanId: number | null = null;

  totalEmis = 0;
  paidEmis = 0;
  pendingEmis = 0;
  outstandingBalance = 0;

  constructor(
    private service: Loanservice,
    private authService: AuthService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const loggedInUser = this.authService.getUser();
    const customerId = loggedInUser?.customerId || 1;

    this.service.getAccounts().subscribe({
      next: (res: any[]) => {
        // Filter accounts for current customer
        this.accounts = Array.isArray(res) 
          ? res.filter(acc => acc.customerId === customerId)
          : [];

        if (this.accounts.length > 0) {
          this.selectedLoanId = this.accounts[0].loanAccountId;
          this.loadEmiSchedule(this.selectedLoanId!);
        }
        this.cd.detectChanges();
      },
      error: (err) => console.error('Error fetching accounts:', err)
    });
  }

  loadEmiSchedule(loanId: any) {
    const id = Number(loanId);
    if (!id) return;

    // Fetch loan account details for outstanding balance
    this.service.getLoanAccount(id).subscribe({
      next: (account: any) => {
        this.outstandingBalance = account.outstandingPrincipal || 0;
        this.cd.detectChanges();
      },
      error: (err) => console.error('Error fetching loan account:', err)
    });

    // Fetch EMI schedule
    this.service.getEmiSchedule(id).subscribe({
      next: (res: any[]) => {
        console.log('EMI Schedule fetched from DB for Loan ID ' + id + ':', res);
        this.emis = res || [];
        this.totalEmis = this.emis.length;
        this.paidEmis = this.emis.filter((e: any) => e.paymentStatus === 'Paid').length;
        this.pendingEmis = this.emis.filter((e: any) => e.paymentStatus === 'Pending').length;
        this.cd.detectChanges();
      },
      error: (err) => console.error('Error fetching EMI schedule:', err)
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
