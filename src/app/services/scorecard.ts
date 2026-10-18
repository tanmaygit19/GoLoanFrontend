import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Scorecardservice {
  private http = inject(HttpClient);
  url = `${environment.apiUrl}/ScoreCard`;

  getScoreCard(id: any) {
    return this.http.get<any>(`${this.url}/${id}`);
  }
}
