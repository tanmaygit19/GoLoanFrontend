import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustomerService } from '../../core/services/customer.service';
import { CustomerProfileData } from '../../core/models/customer.models';

export interface OfficerCustomerRow {
  id: number;
  name: string;
  kyc: string;
  cibil: number;
  loan: number;
  status: string;
  date: string;
  appliedDate?: string;
}

@Component({
  selector: 'app-officer-customers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './officer-customers.html',
  styleUrl: './officer-customers.scss'
})
export class OfficerCustomers implements OnInit {
  private customerService = inject(CustomerService);
  private cd = inject(ChangeDetectorRef);

  customers: OfficerCustomerRow[] = [];
  totalEntries = 0;
  isLoading = false;

  selectedKyc = 'KYC';
  selectedLoanStatus = 'Loan Status';
  selectedDateFilter = 'Date';
  fromDate = '';
  toDate = '';
  searchQuery = '';

  pageSize = 10;
  currentPage = 1;

  showProfileModal = false;
  selectedProfile: CustomerProfileData | null = null;
  loadingProfile = false;

  ngOnInit(): void {
    this.fetchCustomers();
  }

  fetchCustomers(): void {
    this.isLoading = true;

    let effectiveFromDate = this.fromDate;
    let effectiveToDate = this.toDate;

    if (this.selectedDateFilter === 'Last 7 Days') {
      const d = new Date();
      d.setDate(d.getDate() - 7);
      effectiveFromDate = d.toISOString().split('T')[0];
    } else if (this.selectedDateFilter === 'Last 30 Days') {
      const d = new Date();
      d.setDate(d.getDate() - 30);
      effectiveFromDate = d.toISOString().split('T')[0];
    }

    this.customerService.getOfficerCustomerTable({
      kycStatus: this.selectedKyc,
      loanStatus: this.selectedLoanStatus,
      fromDate: effectiveFromDate,
      toDate: effectiveToDate,
      search: this.searchQuery,
      page: this.currentPage,
      pageSize: this.pageSize
    }).subscribe({
      next: (res) => {
        if (res.success) {
          let list: OfficerCustomerRow[] = res.data || [];

          if (this.selectedDateFilter === 'Ascending') {
            list.sort((a, b) => new Date(a.appliedDate || a.date).getTime() - new Date(b.appliedDate || b.date).getTime());
          } else if (this.selectedDateFilter === 'Descending' || this.selectedDateFilter === 'Most Recent') {
            list.sort((a, b) => new Date(b.appliedDate || b.date).getTime() - new Date(a.appliedDate || a.date).getTime());
          }

          this.customers = list;
          this.totalEntries = res.total || list.length;
        }
        this.isLoading = false;
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load officer customer table', err);
        this.isLoading = false;
        this.cd.detectChanges();
      }
    });
  }

  onFilterChange(): void {
    this.currentPage = 1;
    this.fetchCustomers();
  }

  onSearchChange(): void {
    this.currentPage = 1;
    this.fetchCustomers();
  }

  onPageSizeChange(): void {
    this.currentPage = 1;
    this.fetchCustomers();
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.fetchCustomers();
  }

  get totalPages(): number {
    return Math.ceil(this.totalEntries / this.pageSize) || 1;
  }

  get showingStart(): number {
    return this.totalEntries === 0 ? 0 : (this.currentPage - 1) * this.pageSize + 1;
  }

  get showingEnd(): number {
    const end = this.currentPage * this.pageSize;
    return end > this.totalEntries ? this.totalEntries : end;
  }

  viewProfile(customerId: number): void {
    this.loadingProfile = true;
    this.showProfileModal = true;
    this.selectedProfile = null;

    this.customerService.getCustomerProfile(customerId).subscribe({
      next: (res) => {
        if (res.success) {
          this.selectedProfile = res.profile;
        }
        this.loadingProfile = false;
        this.cd.detectChanges();
      },
      error: () => {
        this.loadingProfile = false;
        this.cd.detectChanges();
      }
    });
  }

  closeProfileModal(): void {
    this.showProfileModal = false;
    this.selectedProfile = null;
  }
}
