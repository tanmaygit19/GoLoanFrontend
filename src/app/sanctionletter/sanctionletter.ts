
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoanService } from '../loan';

@Component({
  imports: [CommonModule, FormsModule],
  selector: 'app-sanctionletter',
  styleUrl: './sanctionletter.scss',
  templateUrl: './sanctionletter.html',
})
export class Sanctionletter {
  loans: any[] = [];
  sanctions: any[] = [];
  loandealid: number | null = null;
  selectedloan: any = null;
  sanction: any = null;
  message = '';

  showdisbursement = false;

  disbursement: any = {
    dealId: null,
    disburseAmount: null,
    disbursementDate: '',
    bankPartner: ''
  };

  selectedsanction: any = null;
  disbursementstatuses: { [key: number]: string } = {};
  submitting = false;

  constructor(private service: LoanService) {
    this.getsanctions();
    this.getdisbursementstatuses();
  }

  getloans() {
    this.service.fetchloansbystatus('Approved').subscribe({
      next: (res: any) => {
        const approvedloans = res.data || [];

        this.loans = approvedloans.filter(
          (loan: any) =>
            !this.sanctions.some(
              (item: any) => item.dealId == loan.dealId
            )
        );

        if (
          this.loandealid != null &&
          !this.loans.some((x: any) => x.dealId == this.loandealid)
        ) {
          this.loandealid = null;
          this.selectedloan = null;
        }
      },
      error: () => {
        this.message = 'Unable to fetch approved loans.';
      }
    });
  }

  getsanctions() {
    this.service.fetchsanction().subscribe({
      next: (res: any) => {
        this.sanctions = res.data || [];
        this.getloans();
      },
      error: () => {
        this.message = 'Unable to fetch sanction letters.';
      }
    });
  }

  selectloan() {
    this.selectedloan = this.loans.find(
      x => x.dealId == this.loandealid
    );
    this.message = '';
  }

  generatesanction() {
    if (this.loandealid == null) {
      this.message = 'Please select a loan.';
      return;
    }

    this.service.generatesanction(this.loandealid).subscribe({
      next: (res: any) => {
        this.message = res.message || 'Sanction generated successfully.';
        this.loandealid = null;
        this.selectedloan = null;
        this.getsanctions();
      },
      error: (err: any) => {
        this.message = err.error?.message || 'Unable to generate sanction letter.';
      }
    });
  }

  viewsanction(id: number) {
    this.service.fetchsanctionbyid(id).subscribe({
      next: (res: any) => {
        this.sanction = res.data;
      },
      error: () => {
        this.message = 'Unable to fetch sanction details.';
      }
    });
  }

  downloadsanction(id: number) {
    this.service.downloadsanction(id).subscribe({
      next: (res: Blob) => {
        const url = window.URL.createObjectURL(res);
        const a = document.createElement('a');

        a.href = url;
        a.download = 'SanctionLetter_' + id + '.pdf';
        a.click();

        window.URL.revokeObjectURL(url);
      },
      error: () => {
        this.message = 'Unable to download sanction letter.';
      }
    });
  }

  opendisbursement(item: any) {
    this.message = '';
    this.selectedsanction = item;

    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');

    this.disbursement = {
      dealId: item.dealId,
      disburseAmount: item.loanAmount,
      disbursementDate: year + '-' + month + '-' + day,
      bankPartner: ''
    };

    this.showdisbursement = true;
  }

  closedisbursement() {
    this.showdisbursement = false;
    this.selectedsanction = null;
  }

  submitdisbursement() {
    if (this.submitting) {
      return;
    }

    if (
      !this.disbursement.disburseAmount ||
      this.disbursement.disburseAmount <= 0
    ) {
      this.message = 'Please enter a valid disbursement amount.';
      return;
    }

    if (!this.disbursement.bankPartner.trim()) {
      this.message = 'Please enter the bank partner.';
      return;
    }

    const dealid = this.disbursement.dealId;

    const data = {
      DealId: dealid,
      DisburseAmount: this.disbursement.disburseAmount,
      BankPartner: this.disbursement.bankPartner.trim()
    };

    this.submitting = true;
    this.message = '';

    this.service.adddisbursement(data).subscribe({
      next: (res: any) => {
        this.message = res.message || 'Disbursement added successfully.';

        this.service.fetchdisbursement().subscribe({
          next: (result: any) => {
            const records = (result.data || [])
              .filter((x: any) => x.dealId == dealid)
              .sort(
                (a: any, b: any) =>
                  new Date(b.disbursementDate).getTime() -
                  new Date(a.disbursementDate).getTime()
              );

            if (records.length === 0) {
              this.submitting = false;
              this.fetchdisbursementstatus(dealid);
              return;
            }

            const latest = records[0];

            if (latest.status === 'Approved') {
              this.message = 'This disbursement is already approved.';
              this.closedisbursement();
              this.submitting = false;
              this.fetchdisbursementstatus(dealid);
              return;
            }

            if (latest.status !== 'Pending') {
              this.message = 'Disbursement was added, but its status is ' + latest.status + '.';
              this.closedisbursement();
              this.submitting = false;
              this.fetchdisbursementstatus(dealid);
              return;
            }

            this.service.approvedisbursement(latest.disbursementId).subscribe({
              next: () => {
                this.message = 'Disbursement approved successfully.';
                this.closedisbursement();
                this.submitting = false;
                this.fetchdisbursementstatus(dealid);
              },
              error: () => {
                this.message = 'Disbursement was added, but approval failed.';
                this.submitting = false;
                this.fetchdisbursementstatus(dealid);
              }
            });
          },
          error: () => {
            this.message = 'Disbursement was added, but status could not be refreshed.';
            this.submitting = false;
          }
        });
      },
      error: (err: any) => {
        this.message = err.error?.message || 'Unable to add disbursement.';
        this.submitting = false;
      }
    });
  }

  getdisbursementstatuses() {
    this.service.fetchdisbursement().subscribe({
      next: (res: any) => {
        const data = res.data || [];

        this.disbursementstatuses = {};

        data.sort(
          (a: any, b: any) =>
            new Date(b.disbursementDate).getTime() -
            new Date(a.disbursementDate).getTime()
        );

        data.forEach((item: any) => {
          if (this.disbursementstatuses[item.dealId] === undefined) {
            this.disbursementstatuses[item.dealId] = item.status;
          }
        });
      },
      error: () => {
        this.message = 'Unable to fetch disbursement statuses.';
      }
    });
  }

  fetchdisbursementstatus(dealid: number) {
    this.service.fetchdisbursement().subscribe({
      next: (res: any) => {
        const records = (res.data || [])
          .filter((x: any) => x.dealId == dealid)
          .sort(
            (a: any, b: any) =>
              new Date(b.disbursementDate).getTime() -
              new Date(a.disbursementDate).getTime()
          );

        this.disbursementstatuses[dealid] = records.length
          ? records[0].status
          : 'Not Disbursed';
      },
      error: () => {
        this.disbursementstatuses[dealid] = 'Unable to fetch status';
      }
    });
  }
}