
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Loanservice {

  constructor(private http: HttpClient) {}

url = 'https://localhost:7074/api/LoanAccount';

  getAccounts() {
    return this.http.get<any>(this.url);
  }

  getEmiSchedule(loanid: number) {
    let u = `https://localhost:7074/api/EmiScheduler/GetEmiSchedule/${loanid}`;
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
