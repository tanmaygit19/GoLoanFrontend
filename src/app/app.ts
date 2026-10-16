import { Component } from '@angular/core';
import {
  RouterOutlet,
  RouterLinkWithHref,
  Router,
  NavigationEnd
} from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLinkWithHref],
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  isModulePage = false;

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isModulePage = event.urlAfterRedirects !== '/';
      }
    });
  }
}