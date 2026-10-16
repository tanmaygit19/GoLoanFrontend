import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private http = inject(HttpClient);

  private customerDashboardUrl = `${environment.apiUrl}/CustomerDashboard`;
  private officerDashboardUrl = `${environment.apiUrl}/Dashboard/OfficerDashboard`;

  getCustomerDashboard(customerId: any): Observable<any> {
    return this.http.get<any>(`${this.customerDashboardUrl}?customerId=${customerId}`);
  }

  getOfficerDashboard(): Observable<any> {
    return this.http.get<any>(this.officerDashboardUrl);
  }

  getDashboard(customerId: any): Observable<any> {
    return this.getCustomerDashboard(customerId);
  }
}
