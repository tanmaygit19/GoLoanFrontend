import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoanService } from '../loan';

@Component({
  selector: 'app-loanaccount',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loanaccount.html'
})
export class Loanaccount {
  accounts: any = [];

  constructor(private service: LoanService) {
    this.service.getaccounts().subscribe({
      next: (data: any) => {
        console.log('API Data:', data);
        this.accounts = data;
      },
      error: (err) => {
        console.log('API Error:', err);
      }
    });
  }
}