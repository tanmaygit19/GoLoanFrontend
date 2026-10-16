import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class Cibilservice {
    http = inject(HttpClient);

    url = "https://localhost:44348/api/Cibil";

    getCibilReport(id: any)
    {
        return this.http.get<any>(`${this.url}/${id}`);
    }
}