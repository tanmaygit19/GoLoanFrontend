
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Scorecardservice {
  http = inject(HttpClient);

  url = 'https://localhost:44348/api/ScoreCard';

  getScoreCard(id: number) {
    return this.http.get<any>(`${this.url}/${id}`);
  }

  getCustomers() {
    return this.http.get<any[]>(`${this.url}/Customers`);
  }
}
