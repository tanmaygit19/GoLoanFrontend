import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import {
LMSReportsService,
LMSReportsDashboardData
} from '../services/lms-reports';

@Component({
selector: 'app-lms-reports-dashboard',
standalone: true,
imports: [CommonModule, RouterLink],
templateUrl: './lms-reports-dashboard.html',
styleUrl: './lms-reports-dashboard.scss'
})
export class LMSReportsDashboardComponent implements OnInit {
dashboardData: LMSReportsDashboardData | null = null;
isLoading = false;
errorMessage = '';

private portfolioColors = [
'#2879d0',
'#e8ad43',
'#36a78b',
'#e66b6b',
'#8a70cc'
];

constructor(private reportsService: LMSReportsService) {}

ngOnInit(): void {
this.loadDashboard();
}

loadDashboard(): void {
  this.isLoading = true;
  this.errorMessage = '';

  this.reportsService.getDashboard().subscribe({
    next: (response) => {
      console.log('Complete API Response:', response);

      console.log(
        'API Collection Efficiency:',
        response.data?.collectionEfficiencyChart
      );

      console.log(
        'API Collection Count:',
        response.data?.collectionEfficiencyChart?.length
      );

      if (response.success && response.data) {
        this.dashboardData = {
          ...response.data,
          collectionEfficiencyChart:
            response.data.collectionEfficiencyChart.slice(0, 3)
        };

        console.log(
          'Chart Data After Assignment:',
          this.dashboardData.collectionEfficiencyChart
        );

        console.log(
          'Chart Record Count:',
          this.collectionEfficiencyChart.length
        );
      } else {
        this.errorMessage =
          response.message || 'Unable to load LMS reports.';
      }

      this.isLoading = false;
    },
    error: (error) => {
      console.error('LMS Reports Dashboard API error:', error);

      this.errorMessage =
        'Unable to load LMS reports. Please check the API connection.';

      this.isLoading = false;
    }
  });
}

get summary() {
return this.dashboardData?.summary;
}

get loanPortfolioChart() {
return this.dashboardData?.loanPortfolioChart ?? [];
}

get collectionEfficiencyChart() {
  return this.dashboardData?.collectionEfficiencyChart ?? [];
}

get totalPortfolioAmount(): number {
return this.loanPortfolioChart.reduce(
(total, item) => total + item.outstandingAmount,
0
);
}

get portfolioDonutBackground(): string {
let currentPercentage = 0;


const segments = this.loanPortfolioChart.map((item, index) => {
  const start = currentPercentage;

  currentPercentage += item.percentage;

  return `${this.portfolioColors[index % this.portfolioColors.length]} ${start}% ${currentPercentage}%`;
});

return segments.length > 0
  ? `conic-gradient(${segments.join(', ')})`
  : '#e9eef5';


}

getPortfolioColor(index: number): string {
return this.portfolioColors[index % this.portfolioColors.length];
}

formatMonth(month: string): string {
const parts = month.split('-');


if (parts.length !== 2) {
  return month;
}

const date = new Date(
  Number(parts[0]),
  Number(parts[1]) - 1,
  1
);

return date.toLocaleDateString('en-IN', {
  month: 'short',
  year: 'numeric'
});


}
}
