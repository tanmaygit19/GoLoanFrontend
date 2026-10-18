import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SupportTicketService } from '../support-ticket';

@Component({
  selector: 'app-ticket-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './ticket-details.html',
  styleUrl: './ticket-details.scss'
})
export class TicketDetails implements OnInit {

  ticket: any = null;
  isLoading = false;
  errorMessage = '';

  constructor(
    private service: SupportTicketService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const ticketId = Number(this.route.snapshot.paramMap.get('id'));

    if (!ticketId || isNaN(ticketId)) {
      this.errorMessage = 'Invalid ticket ID.';
      return;
    }

    this.loadTicket(ticketId);
  }

  loadTicket(ticketId: number): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.service.getTicketById(ticketId).subscribe({
      next: (response: any) => {
        console.log('Ticket Details API response:', response);

        this.ticket = response?.data ?? response?.Data ?? null;
        this.isLoading = false;

        if (!this.ticket) {
          this.errorMessage = 'Ticket details not found.';
        }
      },
      error: (error: any) => {
        console.error('Ticket Details API error:', error);

        this.isLoading = false;
        this.errorMessage = 'Unable to load ticket details.';
      }
    });
  }
}

