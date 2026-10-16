import { Component, ChangeDetectorRef, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DashboardService } from '../../core/services/dashboard.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit {
  private service = inject(DashboardService);
  private authService = inject(AuthService);
  private cd = inject(ChangeDetectorRef);
  private platformId = inject(PLATFORM_ID);

  user: any = null;
  dashboardData: any = null;
  errorMessage = '';
  selectedAccount: string = '';

  get isOfficer(): boolean {
    return this.user?.role?.toLowerCase().includes('officer') || false;
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.user = this.authService.getUser();
      this.loadDashboard();
    }
  }

  loadDashboard(): void {
    if (this.isOfficer) {
      this.service.getOfficerDashboard().subscribe({
        next: (res) => {
          this.dashboardData = res.data;
          this.cd.detectChanges();
        },
        error: (err) => {
          console.error('Error fetching officer dashboard:', err);
          this.dashboardData = {
            totalCustomers: 0,
            totalLoanCustomers: 0,
            totalApprovedKyc: 0,
            totalLoanAmount: 0,
            totalActiveLoans: 0,
            todaysCollection: 0,
            pendingEmiCount: 0,
            foreClosureRequests: 0
          };
          this.cd.detectChanges();
        }
      });
    } else {
      const customerId = this.user?.customerId || 1;
      this.service.getCustomerDashboard(customerId).subscribe({
        next: (res) => {
          this.dashboardData = res.data;
          this.cd.detectChanges();
        },
        error: (err) => {
          console.error('Error fetching customer dashboard:', err);
          this.dashboardData = {
            summary: {
              activeLoans: 0,
              emisPaid: 0,
              upcomingEmiAmount: 0,
              totalAmountPaid: 0,
              totalApplications: 0
            },
            activeLoans: []
          };
          this.cd.detectChanges();
        }
      });
    }
  }
}