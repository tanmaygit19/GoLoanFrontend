import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Foreclosure } from './foreclosure/foreclosure';
import { LoanOfficerforeclosure } from './loan-officerforeclosure/loan-officerforeclosure';

@Component({
  imports: [RouterOutlet, Foreclosure, LoanOfficerforeclosure],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('GoLoan');
}
