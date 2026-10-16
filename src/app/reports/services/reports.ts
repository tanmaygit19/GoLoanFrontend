import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface ReportsSummary {
  totalApplications: number;
  applicationsApproved: number;
  applicationsRejected: number;
  applicationsPending: number;
}

export interface ApplicationFunnelItem {
  stage: string;
  count: number;
}

export interface CibilScoreRange {
  cibilScoreRange: string;
  applicants: number;
  approved: number;
  approvalPercentage: number;
}

export interface ScoreCardWiseItem {
  scoreCard: string;
  applicants: number;
  approved: number;
  rejected: number;
  pending: number;
  approvalPercentage: number;
}

export interface ProductWiseItem {
  product: string;
  totalApplications: number;
  approved: number;
  disbursed: number;
  disbursementPercentage: number;
}

export interface ReportsDashboardData {
  summary: ReportsSummary;
  applicationFunnel: ApplicationFunnelItem[];
  cibilScoreRanges: CibilScoreRange[];
  scoreCardWise: ScoreCardWiseItem[];
  productWise: ProductWiseItem[];
}

export interface ReportsDashboardResponse {
  success: boolean;
  message: string;
  data: ReportsDashboardData;
}

export interface CibilScoreRangeResponse {
  success: boolean;
  message: string;
  data: CibilScoreRange[];
}

@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  private apiUrl = 'https://localhost:7074/api/Reports';

  constructor(private http: HttpClient) {}

  getReportsDashboard(
    fromDate?: string,
    toDate?: string
  ): Observable<ReportsDashboardResponse> {

    let params = new HttpParams();

    if (fromDate) {
      params = params.set('fromDate', fromDate);
    }

    if (toDate) {
      params = params.set('toDate', toDate);
    }

    return this.http.get<ReportsDashboardResponse>(
      `${this.apiUrl}/Dashboard`,
      { params }
    );
  }

  getCibilScoreRange(
    fromDate?: string,
    toDate?: string
  ): Observable<CibilScoreRangeResponse> {

    return this.getReportsDashboard(fromDate, toDate).pipe(
      map(response => ({
        success: response?.success ?? false,
        message: response?.message ?? '',
        data: response?.data?.cibilScoreRanges ?? []
      }))
    );
  }

  getScoreCardWise(
    fromDate?: string,
    toDate?: string
  ): Observable<any> {

    return this.getReportsDashboard(fromDate, toDate).pipe(
      map(response => ({
        success: response?.success ?? false,
        message: response?.message ?? '',
        data: response?.data?.scoreCardWise ?? []
      }))
    );
  }

  getProductWise(
    fromDate?: string,
    toDate?: string
  ): Observable<any> {

    return this.getReportsDashboard(fromDate, toDate).pipe(
      map(response => ({
        success: response?.success ?? false,
        message: response?.message ?? '',
        data: response?.data?.productWise ?? []
      }))
    );
  }
}

