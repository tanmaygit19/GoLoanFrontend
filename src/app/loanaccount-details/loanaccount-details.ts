
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Loanservice } from '../loanservice';
import { RouterLink } from '@angular/router';
@Component({
  imports: [CommonModule,RouterLink],
  selector: 'app-loanaccount-details',
  templateUrl: './loanaccount-details.html',
  styleUrl: './loanaccount-details.scss',
})
export class LoanaccountDetails {

  account: any = null;

  constructor(
    private route: ActivatedRoute,
    private service: Loanservice
  ) {
    const loanId = Number(
      this.route.snapshot.paramMap.get('id')
    );

    if (loanId) {
      this.service.getLoanAccount(loanId).subscribe({
      next: (res: any) => {
  
  this.account = res;
},
        error: (err) => {
          console.log('Error fetching loan account:', err);
        }
      });
    }
  }
}