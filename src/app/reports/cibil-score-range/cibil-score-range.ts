import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { timeout, finalize } from 'rxjs';
import { ReportsService, CibilScoreRange } from '../services/reports';

@Component({
  selector: 'app-cibil-score-range',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cibil-score-range.html',
  styleUrl: './cibil-score-range.scss'
})
export class CibilScoreRangeComponent implements OnInit {

  reportData: CibilScoreRange[] = [];
  filteredData: CibilScoreRange[] = [];

 fromDate = '';
toDate = '';
  isLoading = false;
  errorMessage = '';

  constructor(private reportsService: ReportsService) {}

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

    this.reportsService
      .getReportsDashboard(this.fromDate, this.toDate)
      .pipe(
        timeout(15000),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (response: any) => {
          console.log('Reports Dashboard API response:', response);

          const dashboard = response?.data ?? response?.Data;
          const cibilData =
            dashboard?.cibilScoreRanges ??
            dashboard?.CibilScoreRanges;

          if (
            (response?.success === true || response?.Success === true) &&
            Array.isArray(cibilData)
          ) {
            this.reportData = cibilData;
            this.applyFilters();
          } else {
            this.reportData = [];
            this.filteredData = [];

            this.errorMessage =
              response?.message ??
              response?.Message ??
              'CIBIL score range data was not found in the dashboard response.';
          }
        },
        error: (error: any) => {
          console.error('Reports Dashboard API error:', error);

          this.reportData = [];
          this.filteredData = [];

          if (error?.name === 'TimeoutError') {
            this.errorMessage =
              'The reports dashboard request timed out. Check whether the API is running.';
          } else {
            this.errorMessage =
              error?.error?.message ??
              error?.message ??
              'Unable to load the CIBIL report. Check the API connection.';
          }
        }
      });
  }

  applyFilters(): void {
    this.filteredData = [...this.reportData];
  }

  resetFilters(): void {
    this.fromDate = '2024-01-01';
    this.toDate = '2024-12-31';
    this.loadReport();
  }

  get totalApplicants(): number {
    return this.filteredData.reduce(
      (total, item) => total + (Number(item.applicants) || 0),
      0
    );
  }

  get totalApproved(): number {
    return this.filteredData.reduce(
      (total, item) => total + (Number(item.approved) || 0),
      0
    );
  }

  get totalApprovalPercentage(): number {
    return this.totalApplicants
      ? (this.totalApproved / this.totalApplicants) * 100
      : 0;
  }

  exportReport(): void {
    if (!this.filteredData.length) {
      return;
    }

    const headers = [
      'CIBIL Score Range',
      'Applicants',
      'Approved',
      'Approval %'
    ];

    const rows: (string | number)[][] = this.filteredData.map(item => [
      item.cibilScoreRange,
      item.applicants,
      item.approved,
      `${Number(item.approvalPercentage).toFixed(2)}%`
    ]);

    rows.push([
      'Total',
      this.totalApplicants,
      this.totalApproved,
      `${this.totalApprovalPercentage.toFixed(2)}%`
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
    link.download = 'CIBILScoreRangeReport.csv';

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
  }
}

