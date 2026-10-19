import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SupportTicketService } from '../support-ticket';

@Component({
  selector: 'app-create-ticket',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './create-ticket.html',
  styleUrl: './create-ticket.scss'
})
export class CreateTicket {

  customerId = 2;
  subject = '';
  description = '';
  attachment: File | null = null;

  isSubmitting = false;
  message = '';
  messageClass = '';

  constructor(private service: SupportTicketService) { }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.attachment = input.files?.[0] ?? null;
  }

submitTicket(): void {
  if (!this.subject.trim() || !this.description.trim()) {
    this.message = 'Please enter both subject and description.';
    this.messageClass = 'alert-danger';
    return;
  }

  const formData = new FormData();
  formData.append('Subject', this.subject.trim());
  formData.append('Description', this.description.trim());

  if (this.attachment) {
    formData.append('Attachment', this.attachment);
  }

  this.isSubmitting = true;
  this.message = 'Submitting ticket...';
  this.messageClass = 'alert-info';

  console.log('Sending support ticket request...');

  this.service.addTicket(formData, this.customerId).subscribe({
    next: (response: any) => {
      console.log('Ticket API response:', response);

      this.isSubmitting = false;

      if (response?.success || response?.Success) {
        this.message = 'Support ticket raised successfully!';
        this.messageClass = 'alert-success';

        this.subject = '';
        this.description = '';
        this.attachment = null;

        const fileInput = document.getElementById('attachment') as HTMLInputElement;
        if (fileInput) {
          fileInput.value = '';
        }
      } else {
        this.message = response?.message || response?.Message || 'Ticket submission failed.';
        this.messageClass = 'alert-danger';
      }
    },

    error: (error: any) => {
      console.error('Ticket API error:', error);

      this.isSubmitting = false;
      this.message =
        error.error?.message ||
        error.error?.Message ||
        error.message ||
        'Unable to submit the ticket. Please try again.';

      this.messageClass = 'alert-danger';
    },

    complete: () => {
      this.isSubmitting = false;
      console.log('Ticket request completed.');
    }
  });
}


}

