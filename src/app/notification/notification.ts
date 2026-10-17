import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../notificationservice';
import { AuthService } from '../core/services/auth.service';

@Component({
  imports: [CommonModule],
  selector: 'app-notification',
  styleUrl: './notification.scss',
  templateUrl: './notification.html',
})
export class Notification {
  private service = inject(NotificationService);
  private authService = inject(AuthService);

  notifications: any[] = [];
  showNotifications = false;
  customerId: any = this.authService.getUser()?.customerId || this.authService.getUser()?.userId || 1;

  constructor() {
    this.loadNotifications();
  }

  loadNotifications() {
    this.service.getNotifications(this.customerId).subscribe({
      next: (res) => {
        this.notifications = res || [];
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
