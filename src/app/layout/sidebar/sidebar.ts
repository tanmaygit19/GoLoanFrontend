import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLinkWithHref, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterLinkWithHref, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss'
})
export class Sidebar {
  authService = inject(AuthService);
  user = this.authService.getUser();

  get isOfficer(): boolean {
    return this.user?.role?.toLowerCase().includes('officer') || false;
  }

    openMenus: { [key: string]: boolean } = {
    customerMgmt: false,
    loanProcessing: false,
    requests: false,
    customerMenu: false,
    loanServices: false,
    payments: false
  };

  toggleMenu(name: string): void {
    this.openMenus[name] = !this.openMenus[name];
  }

  onLogout(): void {
    this.authService.logout();
  }
}
