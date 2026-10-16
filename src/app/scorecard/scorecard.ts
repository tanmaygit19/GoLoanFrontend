import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Scorecardservice } from '../services/scorecard';

@Component({
  imports: [CommonModule, FormsModule],
  selector: 'app-scorecard',
  templateUrl: './scorecard.html',
  styleUrl: './scorecard.scss',
})
export class Scorecard {
  customerId: any = 1;
  scoreCard: any;

  constructor(private scorecardservice: Scorecardservice) {
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