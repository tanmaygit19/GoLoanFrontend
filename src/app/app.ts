import { Component } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Foreclosure } from './foreclosure/foreclosure';
import { LoanOfficerforeclosure } from './loan-officerforeclosure/loan-officerforeclosure';

@Component({
  imports: [RouterOutlet, Foreclosure, LoanOfficerforeclosure],
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
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
  protected readonly title = signal('GoLoan');
}
