import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

   
  constructor(private http: HttpClient) {}
  url = 'https://localhost:7074/api/Notification';


  getNotifications(customerId: number) {
    return this.http.get<any[]>(`${this.url}/${customerId}`);
  }

  markAsRead(notificationId: number, customerId: number) {
    return this.http.put(`${this.url}/Read/${notificationId}/${customerId}`,
      {}
    );
  }
}
