import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Loanservice {
  private http = inject(HttpClient);
  url = `${environment.apiUrl}/LoanAccount`;

  getAccounts() {
    return this.http.get<any>(this.url);
  }

  getEmiSchedule(loanid: number) {
    const u = `${environment.apiUrl}/EmiScheduler/GetEmiSchedule/${loanid}`;
    return this.http.get<any>(u);
  }

  getLoanAccount(loanId: number) {
    return this.http.get<any>(`${this.url}/Get/${loanId}`);
  }

  getAccountsPagination(pagenumber: number, pagesize: number) {
    return this.http.get<any>(
      `${this.url}/GetAccountsPagination?pagenumber=${pagenumber}&pagesize=${pagesize}`
    );
  }
}
