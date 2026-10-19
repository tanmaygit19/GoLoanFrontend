
import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Scorecardservice } from '../services/scorecard';

@Component({
  selector: 'app-loan-scorecard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loan-scorecard.html',
  styleUrl: './loan-scorecard.scss'
})
export class LoanScorecard implements OnInit {

  scoreCardService = inject(Scorecardservice);
  route = inject(ActivatedRoute);
  router = inject(Router);
  cdr = inject(ChangeDetectorRef);

  scoreCard: any = null;
  errorMessage = '';

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (id <= 0) {
      this.errorMessage = 'Invalid score card ID.';
      return;
    }

    this.scoreCardService.getScoreCard(id).subscribe({
      next: (data: any) => {
        console.log('Score Card API response:', data);

        this.scoreCard = data;
        this.cdr.detectChanges();
      },
      error: (error: any) => {
        console.error('Score Card API error:', error);
        this.errorMessage = 'Unable to load the score card.';
        this.cdr.detectChanges();
      }
    });
  }

  backToCustomerList() {
    this.router.navigate(['/scorecard']);
  }
}
