import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Scorecardservice } from '../services/scorecard';
import { AuthService } from '../core/services/auth.service';

@Component({
  imports: [CommonModule, FormsModule],
  selector: 'app-scorecard',
  templateUrl: './scorecard.html',
  styleUrl: './scorecard.scss',
})
export class Scorecard implements OnInit {
  private scorecardservice = inject(Scorecardservice);
  private authService = inject(AuthService);

  customerId: any = this.authService.getUser()?.customerId || this.authService.getUser()?.userId || 1;
  scoreCard: any;

  ngOnInit(): void {
    if (this.customerId) {
      this.getScoreCard();
    }
  }

  getScoreCard() {
    this.scorecardservice.getScoreCard(this.customerId).subscribe({
      next: res => {
        console.log(res);
        this.scoreCard = res;
      },
      error: err => {
        console.log(err);
      }
    });
  }
}
