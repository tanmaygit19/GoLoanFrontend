import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-paybtn',
  standalone: true,
  templateUrl: './paybtn.html',
  styleUrl: './paybtn.scss'
})
export class Paybtn {

  @Input() emiScheduleId!: number;

  constructor(private router: Router) {
    
  }

  openEmiPay() {
    if (this.emiScheduleId) {
      this.router.navigate(['/module/emi-pay', this.emiScheduleId]);
    }
  }
}