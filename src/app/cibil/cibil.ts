
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Cibilservice } from '../services/cibil';

@Component({
  selector: 'app-cibil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cibil.html',
  styleUrl: './cibil.scss'
})
export class Cibil {

  customerId: any = 1;
  cibilReport: any;
  customer: any;

  constructor(private cibilservice: Cibilservice) {
  }


checkScore() {
  this.cibilservice.getCibilReport(this.customerId).subscribe({
    next: (res: any) => {
      this.cibilReport = res;

      this.cibilservice.getCustomer(this.customerId).subscribe({
        next: (customer: any) => {
          this.customer = customer;

          this.cibilReport.customerName =
            customer.firstName + ' ' + customer.lastName;

          this.cibilReport.panNumber = customer.pan;
          this.cibilReport.checkDate = new Date().toLocaleDateString('en-IN');
        },
        error: (err: any) => {
          console.log('Customer API Error:', err);
        }
      });
    },
    error: (err: any) => {
      console.log('CIBIL API Error:', err);
    }
  });
}


}
