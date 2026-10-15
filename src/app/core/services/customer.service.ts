import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CustomerProfileResponse } from '../models/customer.models';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/Customer`;

  getCustomerProfile(customerId: number): Observable<CustomerProfileResponse> {
    return this.http.get<CustomerProfileResponse>(`${this.baseUrl}/${customerId}/Profile`);
  }

  updateCustomerProfile(customerId: number, data: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${customerId}/Profile`, data);
  }

  /**
   * Fetch paginated & filtered customer table for Credit Officer
   */
  getOfficerCustomerTable(params: {
    kycStatus?: string;
    loanStatus?: string;
    fromDate?: string;
    toDate?: string;
    search?: string;
    page?: number;
    pageSize?: number;
  }): Observable<any> {
    let httpParams = new HttpParams();

    if (params.kycStatus && params.kycStatus !== 'KYC') {
      // Map 'Done' from dropdown to 'Approved' in backend
      const mappedKyc = params.kycStatus === 'Done' ? 'Approved' : params.kycStatus;
      httpParams = httpParams.set('kycStatus', mappedKyc);
    }
    if (params.loanStatus && params.loanStatus !== 'Loan Status') {
      httpParams = httpParams.set('loanStatus', params.loanStatus);
    }
    if (params.fromDate) {
      httpParams = httpParams.set('fromDate', params.fromDate);
    }
    if (params.toDate) {
      httpParams = httpParams.set('toDate', params.toDate);
    }
    if (params.search) {
      httpParams = httpParams.set('search', params.search.trim());
    }
    if (params.page) {
      httpParams = httpParams.set('page', params.page.toString());
    }
    if (params.pageSize) {
      httpParams = httpParams.set('pageSize', params.pageSize.toString());
    }

    return this.http.get<any>(`${this.baseUrl}/OfficerCustomerTable`, { params: httpParams });
  }
}
