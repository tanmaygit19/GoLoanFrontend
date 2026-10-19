import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PaymentHistoryService {

  http = inject(HttpClient);

  url = 'https://localhost:7074/api/CustomerPaymentHistory';

  getPaymentHistory(type: string, loanAccount: number | null, period: string) {
    let params = new HttpParams().set('period', period);

    if (loanAccount !== null) {
      params = params.set('loanAccount', loanAccount);
    }

    return this.http.get<any[]>(`${this.url}/${type}`, { params });
  }

  getEmiPaymentHistory(loanAccount: number | null, period: string) {
    return this.getPaymentHistory('EmiPayment', loanAccount, period);
  }

  getForeClosurePaymentHistory(loanAccount: number | null, period: string) {
    return this.getPaymentHistory('ForeClosurePayment', loanAccount, period);
  }


    url2 = 'https://localhost:7074/api/LoanAccount';

      getLoanAccounts() {
        return this.http.get<any[]>(this.url2);
      }
}