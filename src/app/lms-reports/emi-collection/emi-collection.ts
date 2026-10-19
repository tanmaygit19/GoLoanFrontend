import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LMSReportsService } from '../services/lms-reports';
import { finalize } from 'rxjs/operators';

export interface EMICollectionItem {
particulars: string;
count: number;
amount: number;
percentage: number;
}

@Component({
selector: 'app-emi-collection',
standalone: true,
imports: [CommonModule, FormsModule],
templateUrl: './emi-collection.html',
styleUrl: './emi-collection.scss'
})
export class EmiCollectionComponent implements OnInit {

reportData: EMICollectionItem[] = [];
filteredData: EMICollectionItem[] = [];

fromDate = '';
toDate = '';
searchTerm = '';

isLoading = false;
errorMessage = '';

private hasSearched = false;

constructor(private lmsReportsService: LMSReportsService) {}

ngOnInit(): void {
this.loadReport();
}

loadReport(): void {
if (this.fromDate && this.toDate && this.fromDate > this.toDate) {
this.errorMessage = 'From date cannot be greater than To date.';
return;
}


this.isLoading = true;
this.errorMessage = '';

this.lmsReportsService.getEMICollection(this.fromDate, this.toDate)
  .pipe(finalize(() => this.isLoading = false))
  .subscribe({
    next: (response: any) => {
      if (response?.success && Array.isArray(response.data)) {
        this.reportData = response.data;
        this.hasSearched = true;
        this.applyFilters();
      } else {
        this.reportData = [];
        this.filteredData = [];
        this.errorMessage = response?.message || 'Unable to load EMI collection report.';
      }
    },
    error: (error: any) => {
      console.error('EMI Collection API error:', error);
      this.reportData = [];
      this.filteredData = [];
      this.errorMessage =
        error?.error?.message ||
        error?.error?.Message ||
        'Unable to load the EMI collection report. Please check the API connection.';
    }
  });


}

searchReport(): void {
this.loadReport();
}

applyFilters(): void {
const term = this.searchTerm.trim().toLowerCase();


this.filteredData = this.reportData.filter(item =>
  (item.particulars ?? '').toLowerCase().includes(term)
);


}

get totalCount(): number {
return this.filteredData.reduce((total, item) => total + item.count, 0);
}

get totalAmount(): number {
return this.filteredData.reduce((total, item) => total + item.amount, 0);
}

get totalPercentage(): number {
const billed = this.filteredData.find(
item => item.particulars.toLowerCase() === 'emi billed'
);


return billed?.percentage ?? 0;


}

get hasData(): boolean {
return this.filteredData.length > 0;
}

exportReport(): void {
if (!this.hasData) {
return;
}


const headers = ['Particulars', 'Count', 'Amount (INR)', 'Percentage'];

const rows: (string | number)[][] = this.filteredData.map(item => [
  item.particulars,
  item.count,
  item.amount.toFixed(2),
  `${item.percentage}%`
]);

rows.push([
  'Total',
  this.totalCount,
  this.totalAmount.toFixed(2),
  `${this.totalPercentage}%`
]);

const csv = [headers, ...rows]
  .map(row =>
    row.map(value => `"${String(value).replace(/"/g, '""')}"`).join(',')
  )
  .join('\r\n');

const blob = new Blob(['\uFEFF' + csv], {
  type: 'text/csv;charset=utf-8;'
});

const url = URL.createObjectURL(blob);
const link = document.createElement('a');

link.href = url;
link.download = 'EMICollectionReport.csv';

document.body.appendChild(link);
link.click();
link.remove();

URL.revokeObjectURL(url);


}
}
