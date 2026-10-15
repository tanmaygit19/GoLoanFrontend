import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  http = inject(HttpClient);

  dashboardUrl = `${environment.apiUrl}/CustomerDashboard`;

  getDashboard(customerId: any) {
    return this.http.get<any>(`${this.dashboardUrl}?customerId=${customerId}`);
  }
}
