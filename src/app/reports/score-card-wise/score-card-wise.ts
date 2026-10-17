import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { finalize, timeout } from 'rxjs';
import { ReportsService, ScoreCardWiseItem } from '../services/reports';

@Component({
  selector: 'app-score-card-wise',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './score-card-wise.html',
  styleUrl: './score-card-wise.scss'
})
export class ScoreCardWiseComponent implements OnInit {

  reportData: ScoreCardWiseItem[] = [];
  filteredData: ScoreCardWiseItem[] = [];

  fromDate = '';
  toDate = '';
  searchTerm = '';

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
          console.log('Score Card Wise Dashboard response:', response);

          const dashboard = response?.data ?? response?.Data;
          const scoreCards =
            dashboard?.scoreCardWise ?? dashboard?.ScoreCardWise;

          if (
            (response?.success === true || response?.Success === true) &&
            Array.isArray(scoreCards)
          ) {
            this.reportData = scoreCards;
            this.applyFilters();
          } else {
            this.reportData = [];
            this.filteredData = [];

            this.errorMessage =
              response?.message ??
              response?.Message ??
              'Score Card Wise report data was not found.';
          }
        },
        error: (error: any) => {
          console.error('Score Card Wise Report API error:', error);

          this.reportData = [];
          this.filteredData = [];

          this.errorMessage = error?.name === 'TimeoutError'
            ? 'The report request timed out. Please check the API.'
            : error?.error?.message ??
              'Unable to load the Score Card Wise Report. Please check the API connection.';
        }
      });
  }

  applyFilters(): void {
    const term = this.searchTerm.trim().toLowerCase();

    this.filteredData = this.reportData.filter(item =>
      (item.scoreCard ?? '').toLowerCase().includes(term)
    );
  }

  resetFilters(): void {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);

    this.fromDate = this.formatDate(firstDay);
    this.toDate = this.formatDate(today);
    this.searchTerm = '';

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

  get totalRejected(): number {
    return this.filteredData.reduce(
      (total, item) => total + (Number(item.rejected) || 0),
      0
    );
  }

  get totalPending(): number {
    return this.filteredData.reduce(
      (total, item) => total + (Number(item.pending) || 0),
      0
    );
  }

  get overallApprovalPercentage(): number {
    return this.totalApplicants > 0
      ? (this.totalApproved / this.totalApplicants) * 100
      : 0;
  }

  exportReport(): void {
    if (this.filteredData.length === 0) {
      return;
    }

    const headers = [
      'Score Card',
      'Applicants',
      'Approved',
      'Rejected',
      'Pending',
      'Approval Percentage'
    ];

    const rows: (string | number)[][] = this.filteredData.map(item => [
      item.scoreCard,
      item.applicants,
      item.approved,
      item.rejected,
      item.pending,
      `${Number(item.approvalPercentage).toFixed(2)}%`
    ]);

    rows.push([
      'Total',
      this.totalApplicants,
      this.totalApproved,
      this.totalRejected,
      this.totalPending,
      `${this.overallApprovalPercentage.toFixed(2)}%`
    ]);

    const csv = [headers, ...rows]
      .map(row =>
        row.map(value =>
          `"${String(value).replace(/"/g, '""')}"`
        ).join(',')
      )
      .join('\r\n');

    const blob = new Blob(['\uFEFF' + csv], {
      type: 'text/csv;charset=utf-8;'
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = 'ScoreCardWiseReport.csv';

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
  }
}

