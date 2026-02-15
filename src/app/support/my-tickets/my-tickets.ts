import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SupportTicketService } from '../support-ticket';

@Component({
selector: 'app-my-tickets',
standalone: true,
imports: [CommonModule, RouterLink],
templateUrl: './my-tickets.html',
styleUrl: './my-tickets.scss'
})
export class MyTickets implements OnInit {

customerId = 2;
tickets: any[] = [];
isLoading = false;
errorMessage = '';

constructor(private service: SupportTicketService) {}

ngOnInit(): void {
this.loadTickets();
}

loadTickets(): void {
this.isLoading = true;
this.errorMessage = '';


this.service.getMyTickets(this.customerId).subscribe({
  next: (response: any) => {
    console.log('My Tickets API response:', response);

    this.tickets = response?.data ?? response?.Data ?? [];
    this.isLoading = false;
  },
  error: (error: any) => {
    console.error('My Tickets API error:', error);

    this.tickets = [];
    this.errorMessage = 'Unable to load your support tickets.';
    this.isLoading = false;
  }
});


}

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
