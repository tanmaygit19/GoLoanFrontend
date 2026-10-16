import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LMSReportsService } from '../services/lms-reports';

export interface OverdueReportItem {
  daysOverdue: string;
  accounts: number;
  outstandingAmount: number;
}

@Component({
  selector: 'app-overdue',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './overdue.html',
  styleUrl: './overdue.scss'
})
export class OverdueComponent implements OnInit {

  reportData: OverdueReportItem[] = [];
  filteredData: OverdueReportItem[] = [];

  isLoading = false;
  errorMessage = '';

  asOnDate = this.getTodayDate();
  searchTerm = '';

  constructor(private lmsReportsService: LMSReportsService) {}

  ngOnInit(): void {
    this.loadReport();
  }

  private getTodayDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  loadReport(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.lmsReportsService.getOverdue().subscribe({
      next: (response: any) => {
        if (response?.success && Array.isArray(response.data)) {
          this.reportData = response.data;
          this.applyFilters();
        } else {
          this.reportData = [];
          this.filteredData = [];
          this.errorMessage =
            response?.message || 'Unable to load the overdue report.';
        }

        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Overdue Report API error:', error);

        this.errorMessage =
          'Unable to load the overdue report. Please check the API connection.';

        this.isLoading = false;
      }
    });
  }

  applyFilters(): void {
    const term = this.searchTerm.trim().toLowerCase();

    this.filteredData = this.reportData.filter(item =>
      (item.daysOverdue ?? '').toLowerCase().includes(term)
    );
  }

  get totalAccounts(): number {
    return this.filteredData.reduce(
      (total, item) => total + item.accounts,
      0
    );
  }

  get totalOutstandingAmount(): number {
    return this.filteredData.reduce(
      (total, item) => total + item.outstandingAmount,
      0
    );
  }

  exportReport(): void {
    if (this.filteredData.length === 0) {
      return;
    }

    const headers = [
      'As On Date',
      'Days Overdue',
      'Accounts',
      'Outstanding Amount'
    ];

    const rows: (string | number)[][] = this.filteredData.map(item => [
      this.asOnDate,
      item.daysOverdue,
      item.accounts,
      item.outstandingAmount
    ]);

    rows.push([
      this.asOnDate,
      'Total',
      this.totalAccounts,
      this.totalOutstandingAmount
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
    link.download = `OverdueReport_${this.asOnDate}.csv`;

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
  }
}

