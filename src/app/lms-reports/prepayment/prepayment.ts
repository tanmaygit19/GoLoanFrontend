
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { LMSReportsService } from '../services/lms-reports';

export interface PrepaymentItem {
  type: string;
  accounts: number;
  prepaymentAmount: number;
}

@Component({
  selector: 'app-prepayment',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './prepayment.html',
  styleUrl: './prepayment.scss'
})
export class PrepaymentComponent implements OnInit {

  reportData: PrepaymentItem[] = [];
  filteredData: PrepaymentItem[] = [];

  fromDate = '';
  toDate = '';
  searchTerm = '';

  isLoading = false;
  errorMessage = '';

  constructor(private reportsService: LMSReportsService) {}

  ngOnInit(): void {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);

    this.fromDate = this.formatDate(firstDay);
    this.toDate = this.formatDate(today);

    this.loadReport();
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  loadReport(): void {
    if (this.fromDate && this.toDate && this.fromDate > this.toDate) {
      this.errorMessage = 'From Date cannot be greater than To Date.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.reportsService.getPrepayment(this.fromDate, this.toDate)
      .subscribe({
        next: (response: any) => {
          const data = response?.data ?? response?.Data;

          if (response?.success === true || response?.Success === true) {
            this.reportData = Array.isArray(data) ? data : [];
            this.applyFilters();
          } else {
            this.reportData = [];
            this.filteredData = [];

            this.errorMessage =
              response?.message ??
              response?.Message ??
              'Unable to load the prepayment report.';
          }

          this.isLoading = false;
        },
        error: (error: any) => {
          console.error('Prepayment Report API error:', error);

          this.errorMessage =
            'Unable to load the prepayment report. Please check the API connection.';

          this.isLoading = false;
        }
      });
  }

  applyFilters(): void {
    const term = this.searchTerm.trim().toLowerCase();

    this.filteredData = this.reportData.filter(item =>
      (item.type ?? '').toLowerCase().includes(term)
    );
  }

  get totalAccounts(): number {
    return this.filteredData.reduce(
      (total, item) => total + (Number(item.accounts) || 0),
      0
    );
  }

  get totalPrepaymentAmount(): number {
    return this.filteredData.reduce(
      (total, item) => total + (Number(item.prepaymentAmount) || 0),
      0
    );
  }

  exportReport(): void {
    if (this.filteredData.length === 0) {
      return;
    }

    const headers = [
      'Prepayment Type',
      'Accounts',
      'Prepayment Amount (INR)'
    ];

    const rows: (string | number)[][] = this.filteredData.map(item => [
      item.type,
      item.accounts,
      item.prepaymentAmount
    ]);

    rows.push([
      'Total',
      this.totalAccounts,
      this.totalPrepaymentAmount
    ]);

    const csv = [headers, ...rows]
      .map(row =>
        row.map(value =>
          `"${String(value).replace(/"/g, '""')}"`
        ).join(',')
      )
      .join('\r\n');

    const blob = new Blob(
      ['\uFEFF' + csv],
      { type: 'text/csv;charset=utf-8;' }
    );

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = 'PrepaymentReport.csv';

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
  }

  refreshReport(): void {
    this.loadReport();
  }
}

