
import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Eligibilityservice } from '../services/eligibility';

@Component({
  selector: 'app-officer-review',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './officer-review.html',
  styleUrl: './officer-review.scss'
})
export class OfficerReview {

  applications: any[] = [];
  message: string = '';

  constructor(
    private eligibilityService: Eligibilityservice,
    private cdr: ChangeDetectorRef
  ) {}

  // Load applications waiting for review
  getApplications() {
    this.message = '';

    this.eligibilityService.getManualReviewApplications().subscribe({
      next: (res: any[]) => {
        this.applications = res;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error(err);
        this.message = 'Unable to load applications.';
        this.cdr.detectChanges();
      }
    });
  }

  // Approve application
  approveApplication(eligibilityId: number) {
    if (!confirm('Are you sure you want to approve this application?')) {
      return;
    }

    this.eligibilityService.approveApplication(eligibilityId).subscribe({
      next: () => {
        this.message = 'Application approved successfully.';
        this.getApplications();
      },
      error: (err: any) => {
        console.error(err);
        this.message = 'Unable to approve application.';
        this.cdr.detectChanges();
      }
    });
  }

  // Reject application
  rejectApplication(app: any) {
    if (!app.rejectionReasonInput?.trim()) {
      this.message = 'Please enter a rejection reason.';
      return;
    }

    this.eligibilityService.rejectApplication(
      app.eligibilityId,
      app.rejectionReasonInput
    ).subscribe({
      next: () => {
        this.message = 'Application rejected successfully.';
        this.getApplications();
      },
      error: (err: any) => {
        console.error(err);
        this.message = 'Unable to reject application.';
        this.cdr.detectChanges();
      }
    });
  }
}
