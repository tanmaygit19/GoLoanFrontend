import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Cibilservice } from '../services/cibil';
import { AuthService } from '../core/services/auth.service';

@Component({
  imports: [CommonModule, FormsModule],
  selector: 'app-cibil',
  templateUrl: './cibil.html',
  styleUrl: './cibil.scss',
})
export class Cibil implements OnInit {
  private cibilservice = inject(Cibilservice);
  private authService = inject(AuthService);

  customerId: any = this.authService.getUser()?.customerId || this.authService.getUser()?.userId || 1;
  cibilReport: any;

  ngOnInit(): void {
    if (this.customerId) {
      this.getCibilReport();
    }
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
