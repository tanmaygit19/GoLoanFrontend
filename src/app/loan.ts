import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoanService {
  private http = inject(HttpClient);

  private apiurl = `${environment.apiUrl}/LoanDealCreation/ApplyLoan`;
  private accounturl = `${environment.apiUrl}/LoanAccount`;
  private sanctionurl = `${environment.apiUrl}/SanctionLetter`;
  private disbursementurl = `${environment.apiUrl}/Disbursement`;

  addloan(data: any) {
    return this.http.post(this.apiurl, data);
  }

  getaccounts() {
    return this.http.get(this.accounturl);
  }

  getbyid(id: number) {
    return this.http.get(`${this.accounturl}/Get/${id}`);
  }

  fetchloansbystatus(status: string) {
    return this.http.get(
      `${environment.apiUrl}/LoanDealCreation/FetchLoansByStatus?status=${status}`
    );
  }

  approveloan(data: any) {
    return this.http.put(
      `${environment.apiUrl}/LoanDealCreation/ApproveLoan`,
      data
    );
  }

  rejectloan(data: any) {
    return this.http.put(
      `${environment.apiUrl}/LoanDealCreation/RejectLoan`,
      data
    );
  }

  generatesanction(loandealid: number) {
    return this.http.post(
      `${this.sanctionurl}/GenerateSanction?loandealid=${loandealid}`,
      null
    );
  }

  fetchsanction() {
    return this.http.get(`${this.sanctionurl}/FetchSanction`);
  }

  fetchsanctionbyid(sanctionid: number) {
    return this.http.get(
      `${this.sanctionurl}/FetchSanctionById?sanctionid=${sanctionid}`
    );
  }

  downloadsanction(sanctionid: number) {
    return this.http.get(
      `${this.sanctionurl}/DownloadSanction/${sanctionid}`,
      { responseType: 'blob' }
    );
  }

  adddisbursement(data: any) {
    return this.http.post(
      `${this.disbursementurl}/AddDisbursement`,
      data
    );
  }

  fetchdisbursement() {
    return this.http.get(`${this.disbursementurl}/FetchDisbursement`);
  }

  fetchdisbursementbyid(id: number) {
    return this.http.get(
      `${this.disbursementurl}/FetchDisbursementById?id=${id}`
    );
  }

  fetchdisbursementsbystatus(status: string) {
    return this.http.get(
      `${this.disbursementurl}/FetchDisbursementsByStatus?status=${status}`
    );
  }

  approvedisbursement(id: number) {
    return this.http.put(
      `${this.disbursementurl}/ApproveDisbursement?disbursementid=${id}`,
      null
    );
  }

  rejectdisbursement(id: number) {
    return this.http.put(
      `${this.disbursementurl}/RejectDisbursement?disbursementid=${id}`,
      null
    );
  }
}
