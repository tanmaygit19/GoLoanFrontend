
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../notificationservice';


@Component({
  imports: [CommonModule],
  selector: 'app-notification',
  styleUrl: './notification.scss',
  templateUrl: './notification.html',
})
export class Notification {
  notifications: any[] = [];
  showNotifications = false;
  customerId = 1;

  constructor(private service:NotificationService) {
    this.loadNotifications();
  }

  loadNotifications() {
    this.service.getNotifications(this.customerId).subscribe({
      next: (res) => {
        this.notifications = res;
      },
      error: (err) => {
        console.log('Error loading notifications:', err);
      }
    });
  }

  markAsRead(notificationId: number) {
    this.service.markAsRead(notificationId, this.customerId).subscribe({
      next: () => {
        this.loadNotifications();
      },
      error: (err) => {
        console.log('Error marking notification as read:', err);
      }
    });
  }
}
