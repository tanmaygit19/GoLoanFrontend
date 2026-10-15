import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { AuthResponse, GoogleLoginDTO, LoginRequest, RegisterDTO, VerifyOtpDTO } from '../models/auth.models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  http = inject(HttpClient);
  router = inject(Router);

  loginUrl = `${environment.apiUrl}/Auth/Login`;
  registerUrl = `${environment.apiUrl}/Auth/Register`;
  googleLoginUrl = `${environment.apiUrl}/Auth/GoogleLogin`;
  setup2faUrl = `${environment.apiUrl}/Auth/Setup2FA`;
  verify2faUrl = `${environment.apiUrl}/Auth/Verify2FA`;

  login(data: LoginRequest) {
    return this.http.post<AuthResponse>(this.loginUrl, data);
  }

  register(data: RegisterDTO) {
    return this.http.post<any>(this.registerUrl, data);
  }

  googleLogin(data: GoogleLoginDTO) {
    return this.http.post<AuthResponse>(this.googleLoginUrl, data);
  }

  setup2FA(data: VerifyOtpDTO, preAuthToken: string, tempSecret: string) {
    const headers = new HttpHeaders({
      'X-PreAuth-Token': preAuthToken,
      'X-Temp-Secret': tempSecret
    });
    return this.http.post<AuthResponse>(this.setup2faUrl, data, { headers });
  }

  verify2FA(data: VerifyOtpDTO, preAuthToken: string) {
    const headers = new HttpHeaders({
      'X-PreAuth-Token': preAuthToken
    });
    return this.http.post<AuthResponse>(this.verify2faUrl, data, { headers });
  }

  getToken() {
    return localStorage.getItem('token');
  }

  getUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  isLoggedIn(): boolean {
    return !!this.getToken() || !!this.getUser();
  }

  logout() {
    localStorage.clear();
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }
}
