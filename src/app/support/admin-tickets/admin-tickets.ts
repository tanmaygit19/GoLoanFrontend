import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SupportTicketService } from '../support-ticket';

@Component({
  selector: 'app-admin-tickets',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './admin-tickets.html',
  styleUrl: './admin-tickets.scss'
})
export class AdminTickets implements OnInit {

  tickets: any[] = [];
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  selectedTicket: any = null;
  updatedStatus = 'Pending';
  officerResponse = '';

  constructor(private service: SupportTicketService) {}

  ngOnInit(): void {
    this.loadTickets();
  }

  // Fetch all support tickets
  loadTickets(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.service.getAllTickets().subscribe({
      next: (response: any) => {
        console.log('All Tickets API response:', response);

        this.tickets = response?.data ?? response?.Data ?? [];
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('All Tickets API error:', error);

        this.errorMessage = 'Unable to load support tickets.';
        this.isLoading = false;
      }
    });
  }

  // Open the ticket management form
  manageTicket(ticket: any): void {
    this.selectedTicket = ticket;
    this.updatedStatus = ticket.status ?? ticket.Status ?? 'Pending';
    this.officerResponse =
      ticket.officerResponse ?? ticket.OfficerResponse ?? '';

    this.successMessage = '';
    this.errorMessage = '';
  }

  // Update ticket status and officer response
  updateTicket(): void {
    if (!this.selectedTicket) {
      return;
    }

    const ticketId =
      this.selectedTicket.ticketId ?? this.selectedTicket.TicketId;

    const data = {
      status: this.updatedStatus,
      officerResponse: this.officerResponse
    };

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.service.updateTicket(ticketId, data).subscribe({
      next: (response: any) => {
        console.log('Update Ticket API response:', response);

        this.isLoading = false;
        this.successMessage =
          response?.message ??
          response?.Message ??
          'Ticket updated successfully.';

        this.selectedTicket = null;
        this.loadTickets();
      },
      error: (error: any) => {
        console.error('Update Ticket API error:', error);

        this.isLoading = false;
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

  // Close the management form
  cancelManage(): void {
    this.selectedTicket = null;
    this.errorMessage = '';
    this.successMessage = '';
  }
}

