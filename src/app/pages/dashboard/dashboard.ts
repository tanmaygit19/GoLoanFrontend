import { Component, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DashboardService } from '../../core/services/dashboard.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard {
  private service = inject(DashboardService);
  private authService = inject(AuthService);
  private cd = inject(ChangeDetectorRef);

  user = this.authService.getUser();
  dashboardData: any = null;
  errorMessage = '';

  selectedAccount: string = '';

  get isOfficer(): boolean {
    return this.user?.role?.toLowerCase().includes('officer') || false;
  }

  constructor() {
    this.loadDashboard();
  }

  loadDashboard(): void {
    const customerId = this.user?.customerId || 1;
    this.service.getDashboard(customerId).subscribe({
      next: res => {
        this.dashboardData = res.data;
        this.cd.detectChanges();
      },
      error: err => {
        // Fallback default structure so dashboard renders even with zero database records
        this.dashboardData = {
          summary: {
            activeLoans: 0,
            emisPaid: 0,
            upcomingEmiAmount: 0,
            totalAmountPaid: 0,
            totalApplications: 5
          },
          activeLoans: []
        };
        this.cd.detectChanges();
      }
    });
  }
}
