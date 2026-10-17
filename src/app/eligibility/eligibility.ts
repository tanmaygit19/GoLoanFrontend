import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Eligibilityservice } from '../services/eligibility';
import { AuthService } from '../core/services/auth.service';

@Component({
  imports: [CommonModule, FormsModule],
  selector: 'app-eligibility',
  templateUrl: './eligibility.html',
  styleUrl: './eligibility.scss',
})
export class Eligibility implements OnInit {
  private eligibilityservice = inject(Eligibilityservice);
  private authService = inject(AuthService);

  customerId: any = this.authService.getUser()?.customerId || this.authService.getUser()?.userId || 1;
  eligibility: any;

  ngOnInit(): void {
    if (this.customerId) {
      this.getEligibility();
    }
  }

  getEligibility() {
    this.eligibilityservice.getEligibility(this.customerId).subscribe({
      next: res => {
        console.log(res);
        this.eligibility = res;
      },
      error: err => {
        console.log(err);
      }
    });
  }
}
