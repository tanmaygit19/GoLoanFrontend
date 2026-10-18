
import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Scorecardservice } from '../services/scorecard';

@Component({
  selector: 'app-scorecard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './scorecard.html',
  styleUrl: './scorecard.scss'
})
export class Scorecard implements OnInit {

  scoreCardService = inject(Scorecardservice);
  router = inject(Router);
  cdr = inject(ChangeDetectorRef);

  customers: any[] = [];

  ngOnInit() {
    this.getCustomers();
  }

  getCustomers() {
    this.scoreCardService.getCustomers().subscribe({
      next: (data: any[]) => {
        console.log('Customers received:', data);

        this.customers = data;
        this.cdr.detectChanges();
      },
      error: (error: any) => {
        console.error('Customer API error:', error);
      }
    });
  }

  viewScoreCard(id: number) {
    this.router.navigate(['/loan-scorecard', id]);
  }
}
