import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { LMSReportsService } from '../services/lms-reports';

export interface DisbursementItem {
  month: string;
  loansDisbursed: number;
  disbursementAmount: number;
}

@Component({
  selector: 'app-disbursement',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './disbursement.html',
  styleUrl: './disbursement.scss'
})
export class DisbursementComponent implements OnInit {
  reportData: DisbursementItem[] = [];
  filteredData: DisbursementItem[] = [];

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

    this.reportsService.getDisbursementReport(this.fromDate, this.toDate)
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
              'Unable to load the disbursement report.';
          }

          this.isLoading = false;
        },
        error: (error: any) => {
          console.error('Disbursement Report API error:', error);

          this.errorMessage =
            'Unable to load the disbursement report. Please check the API connection.';

          this.isLoading = false;
        }
      });
  }

  applyFilters(): void {
    const term = this.searchTerm.trim().toLowerCase();

    this.filteredData = this.reportData.filter(item =>
      (item.month ?? '').toLowerCase().includes(term)
    );
  }

  get totalLoansDisbursed(): number {
    return this.filteredData.reduce(
      (total, item) => total + (Number(item.loansDisbursed) || 0),
      0
    );
  }

  get totalDisbursementAmount(): number {
    return this.filteredData.reduce(
      (total, item) => total + (Number(item.disbursementAmount) || 0),
      0
    );
  }

  exportReport(): void {
    if (this.filteredData.length === 0) {
      return;
    }

    const headers = [
      'Month',
      'Loans Disbursed',
      'Disbursement Amount (INR)'
    ];

    const rows: (string | number)[][] = this.filteredData.map(item => [
      item.month,
      item.loansDisbursed,
      item.disbursementAmount
    ]);

    rows.push([
      'Total',
      this.totalLoansDisbursed,
      this.totalDisbursementAmount
    ]);

    const csv = [headers, ...rows]
      .map(row =>
        row
          .map(value => `"${String(value).replace(/"/g, '""')}"`)
          .join(',')
      )
      .join('\r\n');

    const blob = new Blob(['\uFEFF' + csv], {
      type: 'text/csv;charset=utf-8;'
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = 'DisbursementReport.csv';

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
  }

  refreshReport(): void {
    this.loadReport();
  }
}

