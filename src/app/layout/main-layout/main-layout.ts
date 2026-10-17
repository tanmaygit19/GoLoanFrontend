import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink } from '@angular/router';
import { Sidebar } from '../sidebar/sidebar';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-main-layout',
  imports: [CommonModule, RouterOutlet, RouterLink, Sidebar],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss'
})
export class MainLayout {
  authService = inject(AuthService);
  user = this.authService.getUser();

  get isOfficer(): boolean {
    return this.user?.role?.toLowerCase().includes('officer') || false;
  }
}
