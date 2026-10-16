import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Eligibilityservice } from '../services/eligibility';

@Component({
  imports: [CommonModule, FormsModule],
  selector: 'app-eligibility',
  templateUrl: './eligibility.html',
  styleUrl: './eligibility.scss',
})
export class Eligibility {
  customerId: any = 1;
  eligibility: any;

  constructor(private eligibilityservice: Eligibilityservice) {
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