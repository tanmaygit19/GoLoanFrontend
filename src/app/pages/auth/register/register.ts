import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class Register {
  authService = inject(AuthService);
  router = inject(Router);
  cd = inject(ChangeDetectorRef);

  customerForm = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    age: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    mobileNo: new FormControl('', [Validators.required]),
    pan: new FormControl('', [Validators.required]),
    aadhaarNo: new FormControl('', [Validators.required]),
    employmentType: new FormControl('', [Validators.required]),
    monthlyIncome: new FormControl('', [Validators.required]),
    monthlyInvestment: new FormControl('', [Validators.required])
  });

  errorMessage: string = '';

  onRegister() {
    this.errorMessage = '';
    const val: any = this.customerForm.value;

    const payload: any = {
      firstName: val.firstName,
      lastName: val.lastName,
      email: val.email,
      mobile: val.mobileNo,
      password: val.password,
      confirmPassword: val.password,
      roleId: 1,
      age: val.age ? Number(val.age) : null,
      pan: val.pan ? String(val.pan).toUpperCase().trim() : null,
      aadhaarNo: val.aadhaarNo ? String(val.aadhaarNo).trim() : null,
      employmentType: val.employmentType,
      monthlyIncome: val.monthlyIncome ? Number(val.monthlyIncome) : null,
      monthlyInvestment: val.monthlyInvestment ? Number(val.monthlyInvestment) : null
    };

    this.authService.register(payload).subscribe({
      next: () => {
        alert('Customer registered successfully! Please login to continue.');
        this.router.navigate(['/login']);
      },
      error: err => {
        console.error('Registration Error Details:', err.error);

        if (err.error?.errors) {
          const errorList = Object.keys(err.error.errors)
            .map(key => err.error.errors[key].join(', '))
            .join(' | ');
          this.errorMessage = errorList;
        } else {
          this.errorMessage = err.error?.message || 'Registration failed. Please check form fields.';
        }

        this.cd.detectChanges();
      }
    });
  }

  onBack() {
    this.router.navigate(['/login']);
  }
}
