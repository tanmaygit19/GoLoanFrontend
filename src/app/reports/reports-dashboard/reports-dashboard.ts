import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReportsService, ReportsDashboardData } from '../services/reports';

@Component({
selector: 'app-reports-dashboard',
standalone: true,
imports: [CommonModule, RouterLink],
templateUrl: './reports-dashboard.html',
styleUrl: './reports-dashboard.scss'
})
export class ReportsDashboard implements OnInit {
dashboardData: ReportsDashboardData | null = null;
isLoading = false;
errorMessage = '';

constructor(private reportsService: ReportsService) {}

ngOnInit(): void {
this.loadReportsDashboard();
}

loadReportsDashboard(): void {
this.isLoading = true;
this.errorMessage = '';


this.reportsService.getReportsDashboard().subscribe({
  next: (response) => {
    if (response.success && response.data) {
      this.dashboardData = response.data;
    } else {
      this.errorMessage = response.message || 'Unable to load reports.';
    }

    this.isLoading = false;
  },
  error: (error) => {
    console.error('Reports dashboard API error:', error);
    this.errorMessage = 'Unable to load reports. Please check the API connection.';
    this.isLoading = false;
  }
});


}

get summary() {
return this.dashboardData?.summary;
}

get applicationFunnel() {
return this.dashboardData?.applicationFunnel ?? [];
}
}
