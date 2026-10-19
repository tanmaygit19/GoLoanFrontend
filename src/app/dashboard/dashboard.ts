import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit {

  dashboardData: any = null;
  isLoading = false;
  errorMessage = '';

  customerId = 2;

 private apiUrl = 'https://localhost:7074/api/CustomerDashboard';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.http.get<any>(`${this.apiUrl}?customerId=${this.customerId}`).subscribe({
      next: (response: any) => {
        console.log('Dashboard API response:', response);

        this.dashboardData = response?.data ?? response?.Data ?? null;

        if (!this.dashboardData) {
          this.errorMessage = 'Dashboard data not found.';
        }

        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Dashboard API error:', error);

        this.errorMessage = 'Unable to load dashboard data.';
        this.isLoading = false;
      }
    });
  }

  get summary(): any {
    return this.dashboardData?.summary ?? this.dashboardData?.Summary;
  }

  get applications(): any[] {
    return this.dashboardData?.applications ?? this.dashboardData?.Applications ?? [];
  }

  get activeLoans(): any[] {
    return this.dashboardData?.activeLoans ?? this.dashboardData?.ActiveLoans ?? [];
  }

  get emiSummary(): any {
    return this.dashboardData?.emiSummary ?? this.dashboardData?.EmiSummary;
  }

  get recentPayments(): any[] {
    return this.dashboardData?.recentPayments ?? this.dashboardData?.RecentPayments ?? [];
  }

  get documents(): any[] {
    return this.dashboardData?.documents ?? this.dashboardData?.Documents ?? [];
  }
}

