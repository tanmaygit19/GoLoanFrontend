import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class Eligibilityservice {
    http = inject(HttpClient);

    url = "https://localhost:44348/api/Eligibility";

    getEligibility(id: any)
    {
        return this.http.get<any>(`${this.url}/${id}`);
    }
}