
import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoanService } from '../loan';
import { Subscription, timer, EMPTY } from 'rxjs';
import { catchError, exhaustMap } from 'rxjs/operators';

@Component({
  selector: 'app-pendingdeals',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pendingdeals.html',
  styleUrl: './pendingdeals.scss'
})
export class Pendingdeals implements OnDestroy {
  loans: any[] = [];
  selectedloan: any = null;
  loading = true;
  processing = false;
  error = '';
  message = '';
  approvedAmount = 0;
  rejectionReason = '';

  private subscription: Subscription;

  constructor(
    private service: LoanService,
    private cdr: ChangeDetectorRef
  ) {
    this.subscription = timer(0, 5000).pipe(
      exhaustMap(() =>
        this.service.fetchloansbystatus('Pending').pipe(
          catchError((err: any) => {
            console.error('Fetch pending deals failed:', err);
            this.loading = false;
            this.error = this.geterror(err);
            this.cdr.detectChanges();
            return EMPTY;
          })
        )
      )
    ).subscribe({
      next: (res: any) => {
        console.log('Pending deals response:', res);

        const records = Array.isArray(res)
          ? res
          : Array.isArray(res?.data)
            ? res.data
            : Array.isArray(res?.$values)
              ? res.$values
              : [];

        this.loans = records.filter(
          (loan: any) =>
            String(loan.currentStatus ?? loan.status ?? '')
              .toLowerCase() === 'pending'
        );

        this.loading = false;
        this.error = '';

        if (this.selectedloan) {
          const updated = this.loans.find(
            (loan: any) => loan.dealId === this.selectedloan.dealId
          );

          if (updated) {
            this.selectedloan = updated;
          } else {
            this.selectedloan = null;
          }
        }

        this.cdr.detectChanges();
      }
    });
  }

  private geterror(err: any): string {
    if (err.status === 0) {
      return 'Cannot connect to the API. Start the .NET backend and verify its HTTPS URL and certificate.';
    }

    if (err.status === 404) {
      return 'Pending deals API returned 404. Check the controller route and endpoint URL.';
    }

    if (err.status === 401 || err.status === 403) {
      return 'The API denied access. Check authentication and authorization.';
    }

    return err.error?.message ||
      err.error?.title ||
      'Unable to fetch pending deals. HTTP status: ' + err.status;
  }

  fetchloans(): void {
    this.loading = true;
    this.error = '';

    this.service.fetchloansbystatus('Pending').subscribe({
      next: (res: any) => {
        const records = Array.isArray(res)
          ? res
          : Array.isArray(res?.data)
            ? res.data
            : Array.isArray(res?.$values)
              ? res.$values
              : [];

        this.loans = records.filter(
          (loan: any) =>
            String(loan.currentStatus ?? loan.status ?? '')
              .toLowerCase() === 'pending'
        );

        this.loading = false;
        this.error = '';
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Refresh pending deals failed:', err);
        this.loading = false;
        this.error = this.geterror(err);
        this.cdr.detectChanges();
      }
    });
  }

  viewprofile(loan: any): void {
    this.selectedloan = loan;
    this.approvedAmount = Number(loan.loanAmount);
    this.rejectionReason = '';
    this.error = '';
    this.message = '';
  }

  closeprofile(): void {
    this.selectedloan = null;
    this.approvedAmount = 0;
    this.rejectionReason = '';
    this.error = '';
    this.message = '';
  }

  approveloan(): void {
    if (!this.selectedloan) {
      this.error = 'Select a loan first.';
      return;
    }

    if (
      !Number.isFinite(Number(this.approvedAmount)) ||
      Number(this.approvedAmount) <= 0 ||
      Number(this.approvedAmount) > Number(this.selectedloan.loanAmount)
    ) {
      this.error = 'Enter a valid approved amount.';
      return;
    }

    const data = {
      DealId: this.selectedloan.dealId,
      ApprovedAmount: Number(this.approvedAmount)
    };

    this.processing = true;
    this.error = '';
    this.message = '';

    this.service.approveloan(data).subscribe({
      next: (res: any) => {
        this.processing = false;
        this.message = res?.message || 'Loan approval completed.';
        this.selectedloan = null;
        this.fetchloans();
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        this.processing = false;
        this.error = this.geterror(err);
        console.error('Approve loan failed:', err);
        this.cdr.detectChanges();
      }
    });
  }

  rejectloan(): void {
    if (!this.selectedloan) {
      this.error = 'Select a loan first.';
      return;
    }

    if (!this.rejectionReason.trim()) {
      this.error = 'Enter a rejection reason.';
      return;
    }

    const data = {
      DealId: this.selectedloan.dealId,
      RejectionReason: this.rejectionReason.trim()
    };

    this.processing = true;
    this.error = '';
    this.message = '';

    this.service.rejectloan(data).subscribe({
      next: (res: any) => {
        this.processing = false;
        this.message = res?.message || 'Loan rejection completed.';
        this.selectedloan = null;
        this.fetchloans();
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        this.processing = false;
        this.error = this.geterror(err);
        console.error('Reject loan failed:', err);
        this.cdr.detectChanges();
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
