import { Component } from '@angular/core';
import { Loanservice } from '../loanservice';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  imports: [CommonModule, FormsModule],
  selector: 'app-loanaccount',
  styleUrl: './loanaccount.scss',
  templateUrl: './loanaccount.html',
})
export class Loanaccount {

  accounts: any[] = [];
  filteredAccounts: any[] = [];
  selectedStatus = 'All Status';
  searchText = '';
  pageNumber = 1;
  pageSize = 5;
  totalPages = 0; 

  constructor(private service: Loanservice, private router: Router) {
    this.getLoans();
  }





getLoans() {
  this.service.getAccountsPagination(this.pageNumber, this.pageSize)
    .subscribe({
      next: (res: any[]) => {
        console.log('Pagination API response:', res);

        this.accounts = res;
        this.totalPages = res.length < this.pageSize
          ? this.pageNumber
          : this.pageNumber + 1;

        this.filterAccounts();
      },
      error: (err) => {
        console.error('Error loading loan accounts:', err);
        this.accounts = [];
        this.filteredAccounts = [];
      }
    });
}




  filterAccounts() {
    if (!Array.isArray(this.accounts)) {
  this.accounts = [];
}
  this.filteredAccounts = this.accounts.filter(account => {
    const matchesStatus =
      this.selectedStatus === 'All Status' ||
      account.loanStatus?.toLowerCase() ===
        this.selectedStatus.toLowerCase();

    const matchesSearch =
      account.loanAccountNo?.toLowerCase().includes(
        this.searchText.toLowerCase().trim()
      );

    return matchesStatus && matchesSearch;
  });
}
viewAccount(loanAccountId: number) {
  this.router.navigate(['/loanaccount-details', loanAccountId]);
}
}