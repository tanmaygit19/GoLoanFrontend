import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Cibilservice } from '../services/cibil';

@Component({
  imports: [CommonModule, FormsModule],
  selector: 'app-cibil',
  templateUrl: './cibil.html',
  styleUrl: './cibil.scss',
})
export class Cibil {
  customerId: any = 1;
  cibilReport: any;

  constructor(private cibilservice: Cibilservice) {
  }

  getCibilReport() {
    this.cibilservice.getCibilReport(this.customerId).subscribe({
      next: res => {
        console.log(res);
        this.cibilReport = res;
      },
      error: err => {
        console.log(err);
      }
    });
  }
}