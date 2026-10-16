import { Injectable } from '@angular/core';
import { HttpClient,HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface LMSReportsSummary {
totalLoans: number;
activeLoans: number;
closedLoans: number;
}

export interface LoanPortfolioChartItem {
product: string;
outstandingAmount: number;
percentage: number;
}

export interface CollectionEfficiencyChartItem {
month: string;
collectionPercentage: number;
}

export interface LMSReportsDashboardData {
summary: LMSReportsSummary;
loanPortfolioChart: LoanPortfolioChartItem[];
collectionEfficiencyChart: CollectionEfficiencyChartItem[];
}

export interface LMSReportsDashboardResponse {
success: boolean;
message: string;
data: LMSReportsDashboardData;
}

export interface EMICollectionItem {
  particulars: string;
  count: number;
  amount: number;
  percentage: number;
}

export interface EMICollectionResponse {
  success: boolean;
  message: string;
  data: EMICollectionItem[];
}

@Injectable({
providedIn: 'root'
})
export class LMSReportsService {
private apiUrl = 'https://localhost:7074/api/LMSReports';

constructor(private http: HttpClient) {}

getDashboard(): Observable<LMSReportsDashboardResponse> {
return this.http.get<LMSReportsDashboardResponse>(
`${this.apiUrl}/Dashboard`
);
}

getLoanPortfolio(): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/LoanPortfolio`);
}

getEMICollection(fromDate?: string, toDate?: string): Observable<EMICollectionResponse> {
  let params = new HttpParams();

  if (fromDate) {
    params = params.set('fromDate', fromDate);
  }

  if (toDate) {
    params = params.set('toDate', toDate);
  }

  return this.http.get<EMICollectionResponse>(
    `${this.apiUrl}/EMICollection`,
    { params }
  );
}

getOverdue(): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/Overdue`);
}

getDisbursementReport(fromDate?: string, toDate?: string): Observable<any> {
  let params = new HttpParams();

  if (fromDate) {
    params = params.set('fromDate', fromDate);
  }

  if (toDate) {
    params = params.set('toDate', toDate);
  }

  return this.http.get<any>(
    `${this.apiUrl}/Disbursement`,
    { params }
  );
}

getPrepayment(fromDate?: string, toDate?: string): Observable<any> {
  let params = new HttpParams();

  if (fromDate) {
    params = params.set('fromDate', fromDate);
  }

  if (toDate) {
    params = params.set('toDate', toDate);
  }

  return this.http.get<any>(`${this.apiUrl}/Prepayment`, { params });
}
}
