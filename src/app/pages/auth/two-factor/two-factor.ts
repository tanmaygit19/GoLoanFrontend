import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-two-factor',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './two-factor.html',
  styleUrl: './two-factor.scss'
})
export class TwoFactor {
  authService = inject(AuthService);
  router = inject(Router);

  isSetup = sessionStorage.getItem('isSetup') === 'true';
  preAuthToken = sessionStorage.getItem('preAuthToken') || '';
  tempSecret = sessionStorage.getItem('tempSecret') || '';
  qrCode = sessionStorage.getItem('qrCode') || '';

  twoFaForm = new FormGroup({
    code: new FormControl('')
  });

  errorMessage: string = '';

  onVerify() {
    this.errorMessage = '';
    const codeVal: any = this.twoFaForm.value;

    const handleSuccess = (res: any) => {
      if (res.success || res.userId) {
        localStorage.setItem('user', JSON.stringify(res));
        localStorage.setItem('token', res.token || 'logged_in');
        this.router.navigate(['/dashboard']);
      } else {
        this.errorMessage = res.message || 'Verification failed';
      }
    };

    if (this.isSetup) {
      this.authService.setup2FA(codeVal, this.preAuthToken, this.tempSecret).subscribe({
        next: res => handleSuccess(res),
        error: err => {
          this.errorMessage = err.error?.message || '2FA setup verification failed.';
        }
      });
    } else {
      this.authService.verify2FA(codeVal, this.preAuthToken).subscribe({
        next: res => handleSuccess(res),
        error: err => {
          this.errorMessage = err.error?.message || 'Invalid 2FA code.';
        }
      });
    }
  }

  onCancel() {
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }
}
