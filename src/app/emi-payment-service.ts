
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EmiPaymentService {

  http = inject(HttpClient);

  url = 'https://localhost:7074/api/EmiPayment/Details';

  getEmiDetails(emiScheduleId: number) {
    return this.http.get<any>(`${this.url}/${emiScheduleId}`);
  }

  url2 = 'https://localhost:7074/api/EmiPayment/CreateOrder';

  createPaymentOrder(emiScheduleId: number) {
    return this.http.post<any>(`${this.url2}/${emiScheduleId}`,{});
  }

  url3 = 'https://localhost:7074/api/EmiPayment/Verify';

  verifyPayment(paymentData: any) {
    return this.http.post<any>(this.url3, paymentData);
  }

}
