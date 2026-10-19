import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Cibilservice {
  private http = inject(HttpClient);

  url = `${environment.apiUrl}/Cibil`;
  customerUrl = `${environment.apiUrl}/CustomerDashboard/CustomerDetails`;

  getCibilReport(id: any) {
    return this.http.get<any>(`${this.url}/${id}`);
  }

  getCustomer(id: any) {
    return this.http.get<any>(`${this.customerUrl}/${id}`);
  }
}