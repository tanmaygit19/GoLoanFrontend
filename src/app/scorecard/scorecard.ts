import {
  Component,
  OnInit,
  inject,
  ChangeDetectorRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Scorecardservice } from '../services/scorecard';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-scorecard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './scorecard.html',
  styleUrl: './scorecard.scss'
})
export class Scorecard implements OnInit {
  scoreCardService = inject(Scorecardservice);
  private authService = inject(AuthService);
  router = inject(Router);
  cdr = inject(ChangeDetectorRef);

  customerId: any =
    this.authService.getUser()?.customerId ||
    this.authService.getUser()?.userId ||
    1;

  scoreCard: any;
  customers: any[] = [];

  ngOnInit(): void {
    if (this.customerId) {
      this.getScoreCard();
    }

    this.getCustomers();
  }

  getScoreCard() {
    this.scoreCardService.getScoreCard(this.customerId).subscribe({
      next: (data: any) => {
        this.scoreCard = data;
        this.cdr.detectChanges();
      },
      error: (error: any) => {
        console.error('Scorecard API error:', error);
      }
    });
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