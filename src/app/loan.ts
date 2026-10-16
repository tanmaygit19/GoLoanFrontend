
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LoanService {
  private apiurl = 'https://localhost:44348/api/LoanDealCreation/ApplyLoan';
  private accounturl = 'https://localhost:44348/api/LoanAccount';
  private sanctionurl = 'https://localhost:44348/api/SanctionLetter';
  private disbursementurl = 'https://localhost:44348/api/Disbursement';

  constructor(private http: HttpClient) {}

  addloan(data: any) {
    return this.http.post(this.apiurl, data);
  }

  getaccounts() {
    return this.http.get(this.accounturl);
  }

  getbyid(id: number) {
    return this.http.get(this.accounturl + '/Get/' + id);
  }

  fetchloansbystatus(status: string) {
    return this.http.get(
      'https://localhost:44348/api/LoanDealCreation/FetchLoansByStatus?status=' + status
    );
  }

  approveloan(data: any) {
    return this.http.put(
      'https://localhost:44348/api/LoanDealCreation/ApproveLoan',
      data
    );
  }

  rejectloan(data: any) {
    return this.http.put(
      'https://localhost:44348/api/LoanDealCreation/RejectLoan',
      data
    );
  }

  generatesanction(loandealid: number) {
    return this.http.post(
      this.sanctionurl + '/GenerateSanction?loandealid=' + loandealid,
      null
    );
  }

  fetchsanction() {
    return this.http.get(this.sanctionurl + '/FetchSanction');
  }

  fetchsanctionbyid(sanctionid: number) {
    return this.http.get(
      this.sanctionurl + '/FetchSanctionById?sanctionid=' + sanctionid
    );
  }

  downloadsanction(sanctionid: number) {
    return this.http.get(
      this.sanctionurl + '/DownloadSanction/' + sanctionid,
      { responseType: 'blob' }
    );
  }

  adddisbursement(data: any) {
    return this.http.post(
      this.disbursementurl + '/AddDisbursement',
      data
    );
  }

  fetchdisbursement() {
    return this.http.get(this.disbursementurl + '/FetchDisbursement');
  }

  fetchdisbursementbyid(id: number) {
    return this.http.get(
      this.disbursementurl + '/FetchDisbursementById?id=' + id
    );
  }

  fetchdisbursementsbystatus(status: string) {
    return this.http.get(
      this.disbursementurl + '/FetchDisbursementsByStatus?status=' + status
    );
  }

  approvedisbursement(id: number) {
    return this.http.put(
      this.disbursementurl + '/ApproveDisbursement?disbursementid=' + id,
      null
    );
  }

  rejectdisbursement(id: number) {
    return this.http.put(
      this.disbursementurl + '/RejectDisbursement?disbursementid=' + id,
      null
    );
  }
}
