import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Cibilservice } from '../services/cibil';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-cibil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cibil.html',
  styleUrl: './cibil.scss'
})
export class Cibil implements OnInit {
  private cibilservice = inject(Cibilservice);
  private authService = inject(AuthService);

  customerId: any =
    this.authService.getUser()?.customerId ||
    this.authService.getUser()?.userId ||
    1;

  cibilReport: any;
  customer: any;

  ngOnInit(): void {
    if (this.customerId) {
      this.getCibilReport();
    }
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
            this.cibilReport.checkDate =
              new Date().toLocaleDateString('en-IN');
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

  getCibilReport() {
    this.cibilservice.getCibilReport(this.customerId).subscribe({
      next: (res: any) => {
        console.log(res);
        this.cibilReport = res;
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }
}