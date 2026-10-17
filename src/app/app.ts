import { Component, signal } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  styleUrl: './app.scss',
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  title = 'goloan-angular';
}
  isModulePage = false;
  protected readonly title = signal('GoLoan');

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isModulePage = event.urlAfterRedirects !== '/';
      }
    });
  }
}
