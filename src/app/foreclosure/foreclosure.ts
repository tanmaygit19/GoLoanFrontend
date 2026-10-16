import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ForeclosureService } from '../foreclosure-service';

@Component({
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  selector: 'app-foreclosure',
  styleUrl: './foreclosure.scss',
  templateUrl: './foreclosure.html',
})
export class Foreclosure {

  requestdata: any;
  loanAccount: any;
  selectedLoan: any = null;

  constructor(private service: ForeclosureService,private cd: ChangeDetectorRef,private router: Router) {
    this.getAllReq();
    this.getLoanAccount();
  }

  foreclosureForm = new FormGroup({
    loanAccountId: new FormControl(''),
    foreclosureType: new FormControl('Full'),
    noOfEmi: new FormControl(''),
    expectedClosureDate: new FormControl(''),
    reason: new FormControl('')
  });

  getAllReq() {
    this.service.getRequest().subscribe({
      next: res => {
        this.requestdata = res;
        this.cd.detectChanges();
      },
      error: err => {
        console.log(err);
      }
    });
  }



  getLoanAccount() {
    this.service.getLoanAccounts().subscribe({
      next: res => {
        this.loanAccount = res;
      },
      error: err => {
        console.log(err);
      }
    });
  }

  onLoanAccountChange() {
    const id = Number(this.foreclosureForm.get('loanAccountId')?.value);

    this.selectedLoan = this.loanAccount.find((x:any) => x.loanAccountId === id) ?? null;
  }

  getData() {
    const formData = this.foreclosureForm.value;

    const request = {
      loanAccountId: Number(formData.loanAccountId),
      foreclosureType: formData.foreclosureType,
      noOfEmi: formData.foreclosureType === 'Partial' ? Number(formData.noOfEmi) : null,
      expectedClosureDate: formData.expectedClosureDate, reason: formData.reason
    };

    this.service.addRequest(request).subscribe({
      next: res => {
        alert('Foreclosure Request Added Successfully');

        this.getAllReq();

        this.foreclosureForm.reset({
          loanAccountId: '',
          foreclosureType: 'Full',
          noOfEmi: '',
          expectedClosureDate: '',
          reason: ''
        });

        this.selectedLoan = null;
      },
      error: err => {
        console.log(err);
      }
    });
  }

  payForeclosure(x: any) {
    if (x.status !== 'Approved' || x.isPaid) {
      return;
    }

    this.router.navigate([
      '/foreclosure-payment',
      x.requestId
    ]);
  }
}
