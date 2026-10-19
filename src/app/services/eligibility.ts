import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Eligibilityservice {
  private http = inject(HttpClient);

  url = `${environment.apiUrl}/Eligibility`;

  getEligibility(id: number) {
    return this.http.get<any>(`${this.url}/${id}`);
  }

  applyForLoan(
    id: number,
    requestedLoanAmount: number,
    loanTenureMonths: number
  ) {
    const params = new HttpParams()
      .set('requestedLoanAmount', requestedLoanAmount)
      .set('loanTenureMonths', loanTenureMonths);

    return this.http.post<any>(
      `${this.url}/Apply/${id}`,
      null,
      { params: params }
    );
  }

  getManualReviewApplications() {
    return this.http.get<any[]>(
      `${this.url}/ManualReview`
    );
  }

  approveApplication(eligibilityId: number) {
    return this.http.put<any>(
      `${this.url}/Approve/${eligibilityId}`,
      null
    );
  }

  rejectApplication(
    eligibilityId: number,
    rejectionReason: string
  ) {
    const params = new HttpParams()
      .set('rejectionReason', rejectionReason);

    return this.http.put<any>(
      `${this.url}/Reject/${eligibilityId}`,
      null,
      { params: params }
    );
  }
}