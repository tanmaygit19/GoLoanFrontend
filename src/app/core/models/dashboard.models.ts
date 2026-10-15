export interface DashboardData {
  summary: {
    totalApplications: number;
    activeLoans: number;
    emisPaid: number;
    upcomingEmiAmount: number;
    totalAmountPaid: number;
  };
  applications: any[];
  activeLoans: any[];
  emiSummary: any;
  recentPayments: any[];
  documents: any[];
}
