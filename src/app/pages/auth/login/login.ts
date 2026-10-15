import { Component, inject, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLinkWithHref } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

declare var google: any;

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterLinkWithHref],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login implements AfterViewInit {
  authService = inject(AuthService);
  router = inject(Router);
  cd = inject(ChangeDetectorRef);

  loginForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl('')
  });

  errorMessage: string = '';

  ngAfterViewInit(): void {
    if (typeof google !== 'undefined') {
      google.accounts.id.initialize({
        client_id: '844251547780-lqpjp7ugp2209lv1bsn5u4aqrj6p4fp7.apps.googleusercontent.com',
        callback: (response: any) => this.handleGoogleLogin(response)
      });
      google.accounts.id.renderButton(
        document.getElementById('googleBtn'),
        { theme: 'outline', size: 'large', width: '100%', text: 'signin_with' }
      );
    }
  }

  handleGoogleLogin(response: any) {
    console.log('Google Credential received, sending to API...');
    this.authService.googleLogin({ idToken: response.credential }).subscribe({
      next: res => {
        if (res.token) {
          localStorage.setItem('token', res.token);
        } else {
          localStorage.setItem('token', 'logged_in');
        }
        localStorage.setItem('user', JSON.stringify(res));
        this.router.navigate(['/dashboard']);
      },
      error: err => {
        this.errorMessage = err.error?.message || 'Google sign-in failed.';
        this.cd.detectChanges();
      }
    });
  }

  onLogin() {
    this.errorMessage = '';
    const val: any = this.loginForm.value;

    this.authService.login(val).subscribe({
      next: res => {
        if (res.requiresTwoFactorSetup) {
          sessionStorage.setItem('preAuthToken', res.preAuthToken || '');
          sessionStorage.setItem('tempSecret', res.tempSecret || '');
          sessionStorage.setItem('qrCode', res.qrCodeBase64 || '');
          sessionStorage.setItem('isSetup', 'true');
          this.router.navigate(['/two-factor']);
        } else if (res.requiresTwoFactor) {
          sessionStorage.setItem('preAuthToken', res.preAuthToken || '');
          sessionStorage.setItem('isSetup', 'false');
          this.router.navigate(['/two-factor']);
        } else if (res.success || res.token) {
          localStorage.setItem('token', res.token || 'logged_in');
          localStorage.setItem('user', JSON.stringify(res));
          this.router.navigate(['/dashboard']);
        } else {
          this.errorMessage = res.message || 'Login failed';
          this.cd.detectChanges();
        }
      },
      error: err => {
        this.errorMessage = err.error?.message || 'Login failed. Please check your credentials.';
        this.cd.detectChanges();
      }
    });
  }
}
