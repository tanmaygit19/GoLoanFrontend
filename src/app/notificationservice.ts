import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private http = inject(HttpClient);
  url = `${environment.apiUrl}/Notification`;

  getNotifications(customerId: number) {
    return this.http.get<any[]>(`${this.url}/${customerId}`);
  }

  markAsRead(notificationId: number, customerId: number) {
    return this.http.put(`${this.url}/Read/${notificationId}/${customerId}`, {});
  }
}
