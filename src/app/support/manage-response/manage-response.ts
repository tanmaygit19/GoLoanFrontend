import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SupportTicketService } from '../support-ticket';

@Component({
  selector: 'app-manage-response',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './manage-response.html',
  styleUrl: './manage-response.scss'
})
export class ManageResponse implements OnInit {

  ticket: any = null;
  ticketId = 0;

  updatedStatus = 'Pending';
  officerResponse = '';

  isLoading = false;
  isSaving = false;

  errorMessage = '';
  successMessage = '';

  constructor(
    private service: SupportTicketService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.ticketId = Number(this.route.snapshot.paramMap.get('id'));

    if (!this.ticketId || isNaN(this.ticketId)) {
      this.errorMessage = 'Invalid ticket ID.';
      return;
    }

    this.loadTicket();
  }

  // Fetch selected ticket details
  loadTicket(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.service.getTicketById(this.ticketId).subscribe({
      next: (response: any) => {
        console.log('Manage Response API:', response);

        this.ticket = response?.data ?? response?.Data ?? null;

        if (this.ticket) {
          this.updatedStatus =
            this.ticket.status ?? this.ticket.Status ?? 'Pending';

          this.officerResponse =
            this.ticket.officerResponse ??
            this.ticket.OfficerResponse ??
            '';
        } else {
          this.errorMessage = 'Ticket details not found.';
        }

        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Manage Response API error:', error);

        this.errorMessage = 'Unable to load ticket details.';
        this.isLoading = false;
      }
    });
  }

  // Save updated status and officer response
  updateTicket(): void {
    if (!this.ticket) {
      return;
    }

    if (!this.officerResponse.trim()) {
      this.errorMessage = 'Please enter an officer response.';
      return;
    }

    const data = {
      status: this.updatedStatus,
      officerResponse: this.officerResponse.trim()
    };

    this.isSaving = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.service.updateTicket(this.ticketId, data).subscribe({
      next: (response: any) => {
        console.log('Update Ticket API response:', response);

        this.isSaving = false;
        this.successMessage =
          response?.message ??
          response?.Message ??
          'Ticket updated successfully.';

        this.loadTicket();
      },
      error: (error: any) => {
        console.error('Update Ticket API error:', error);

        this.isSaving = false;
        this.errorMessage =
          error?.error?.message ??
          error?.error?.Message ??
          'Unable to update ticket.';
      }
    });
  }

  // Status badge colors
  getStatusClass(status: string): string {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'bg-warning text-dark';

      case 'in progress':
        return 'bg-info text-dark';

      case 'completed':
      case 'complete':
        return 'bg-success';

      case 'rejected':
        return 'bg-danger';

      default:
        return 'bg-secondary';
    }
  }
}

