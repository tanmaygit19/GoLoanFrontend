import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SupportTicketService {

  private apiUrl = 'https://localhost:7074/api/SupportTicket';

  constructor(private http: HttpClient) {}

  addTicket(formData: FormData, customerId: number): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/AddTicket?customerId=${customerId}`,
      formData
    );
  }

 getMyTickets(customerId: number): Observable<any> {
  const url = `${this.apiUrl}/MyTickets?customerId=${customerId}`;

  console.log('Calling My Tickets API:', url);

  return this.http.get<any>(url);
}

getTicketById(ticketId: number): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/GetById/${ticketId}`);
}

// Get all support tickets for Admin
getAllTickets(): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/GetAll`);
}

// Update ticket status and officer response
updateTicket(ticketId: number, data: any): Observable<any> {
  return this.http.put<any>(
    `${this.apiUrl}/Update/${ticketId}`,
    data
  );
}
}

