import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LMSReportsService } from '../services/lms-reports';

interface LoanPortfolioItem {
product: string;
activeLoans: number;
outstandingAmount: number;
percentage: number;
}

@Component({
selector: 'app-loan-portfolio',
standalone: true,
imports: [CommonModule, FormsModule],
templateUrl: './loan-portfolio.html',
styleUrl: './loan-portfolio.scss'
})
export class LoanPortfolioComponent implements OnInit {
reportData: LoanPortfolioItem[] = [];
filteredData: LoanPortfolioItem[] = [];

isLoading = false;
errorMessage = '';

asOnDate = new Date().toISOString().slice(0, 10);
selectedBranch = 'All';
searchTerm = '';

constructor(private reportsService: LMSReportsService) {}

ngOnInit(): void {
this.loadReport();
}

loadReport(): void {
this.isLoading = true;
this.errorMessage = '';


this.reportsService.getLoanPortfolio().subscribe({
  next: (response: any) => {
    if (response?.success && Array.isArray(response.data)) {
      this.reportData = response.data;
      this.applyFilters();
    } else {
      this.reportData = [];
      this.filteredData = [];
      this.errorMessage =
        response?.message || 'Unable to load loan portfolio report.';
    }

    this.isLoading = false;
  },
  error: (error: any) => {
    console.error('Loan Portfolio API error:', error);
    this.errorMessage = 'Unable to load the loan portfolio report.';
    this.isLoading = false;
  }
});


}

applyFilters(): void {
const term = this.searchTerm.trim().toLowerCase();


this.filteredData = this.reportData.filter(item =>
  item.product.toLowerCase().includes(term)
);


}

get totalActiveLoans(): number {
return this.filteredData.reduce(
(total, item) => total + item.activeLoans,
0
);
}

get totalOutstandingAmount(): number {
return this.filteredData.reduce(
(total, item) => total + item.outstandingAmount,
0
);
}

get totalPercentage(): number {
return this.filteredData.reduce(
(total, item) => total + item.percentage,
0
);
}

exportReport(): void {
const headers = [
'Product',
'Active Loans',
'Outstanding Amount',
'Percentage'
];


const rows = this.filteredData.map(item => [
  item.product,
  item.activeLoans,
  item.outstandingAmount.toFixed(2),
  item.percentage.toFixed(2) + '%'
]);

rows.push([
  'Total',
  String(this.totalActiveLoans),
  this.totalOutstandingAmount.toFixed(2),
  this.totalPercentage.toFixed(2) + '%'
]);

const csv = [headers, ...rows]
  .map(row => row.map(value =>
    `"${String(value).replace(/"/g, '""')}"`
  ).join(','))
  .join('\r\n');

const blob = new Blob(['\uFEFF' + csv], {
  type: 'text/csv;charset=utf-8;'
});

const url = URL.createObjectURL(blob);
const link = document.createElement('a');

link.href = url;
link.download = 'LoanPortfolioReport.csv';
link.click();

URL.revokeObjectURL(url);


}
}
