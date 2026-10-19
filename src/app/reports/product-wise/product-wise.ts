import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize, timeout } from 'rxjs';
import { ReportsService, ProductWiseItem } from '../services/reports';

@Component({
  selector: 'app-product-wise',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-wise.html',
  styleUrl: './product-wise.scss'
})
export class ProductWiseComponent implements OnInit {

  reportData: ProductWiseItem[] = [];
  filteredData: ProductWiseItem[] = [];

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
          console.log('Product Wise Dashboard response:', response);

          const dashboard = response?.data ?? response?.Data;
          const products = dashboard?.productWise ?? dashboard?.ProductWise;

          if (
            (response?.success === true || response?.Success === true) &&
            Array.isArray(products)
          ) {
            this.reportData = products;
            this.applyFilters();
          } else {
            this.reportData = [];
            this.filteredData = [];
            this.errorMessage =
              response?.message ??
              response?.Message ??
              'Product Wise report data was not found.';
          }
        },
        error: (error: any) => {
          console.error('Product Wise Report API error:', error);

          this.reportData = [];
          this.filteredData = [];

          this.errorMessage = error?.name === 'TimeoutError'
            ? 'The report request timed out. Please check the API.'
            : error?.error?.message ??
              'Unable to load the Product Wise Report. Please check the API connection.';
        }
      });
  }

  applyFilters(): void {
    const term = this.searchTerm.trim().toLowerCase();

    this.filteredData = this.reportData.filter(item =>
      (item.product ?? '').toLowerCase().includes(term)
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

  get totalApplications(): number {
    return this.filteredData.reduce(
      (total, item) => total + (Number(item.totalApplications) || 0),
      0
    );
  }

  get totalApproved(): number {
    return this.filteredData.reduce(
      (total, item) => total + (Number(item.approved) || 0),
      0
    );
  }

  get totalDisbursed(): number {
    return this.filteredData.reduce(
      (total, item) => total + (Number(item.disbursed) || 0),
      0
    );
  }

  get overallDisbursementPercentage(): number {
    return this.totalApplications > 0
      ? (this.totalDisbursed / this.totalApplications) * 100
      : 0;
  }

  exportReport(): void {
    if (this.filteredData.length === 0) {
      return;
    }

    const headers = [
      'Loan Product',
      'Total Applications',
      'Approved',
      'Disbursed',
      'Disbursement Percentage'
    ];

    const rows: (string | number)[][] = this.filteredData.map(item => [
      item.product,
      item.totalApplications,
      item.approved,
      item.disbursed,
      `${Number(item.disbursementPercentage).toFixed(2)}%`
    ]);

    rows.push([
      'Total',
      this.totalApplications,
      this.totalApproved,
      this.totalDisbursed,
      `${this.overallDisbursementPercentage.toFixed(2)}%`
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
    link.download = 'ProductWiseReport.csv';

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
  }
}

