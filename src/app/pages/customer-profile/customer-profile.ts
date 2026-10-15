import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustomerService } from '../../core/services/customer.service';
import { AuthService } from '../../core/services/auth.service';
import { CustomerProfileData } from '../../core/models/customer.models';

@Component({
  selector: 'app-customer-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './customer-profile.html',
  styleUrl: './customer-profile.scss'
})
export class CustomerProfile implements OnInit {
  private customerService = inject(CustomerService);
  private authService = inject(AuthService);
  private cd = inject(ChangeDetectorRef);

  profile: CustomerProfileData | null = null;
  isLoading = true;
  isSaving = false;
  errorMessage = '';

  showEditModal = false;
  editForm: Partial<CustomerProfileData> = {};

  ngOnInit(): void {
    this.loadProfile();
  }

    loadProfile(): void {
    const user = this.authService.getUser();
    const customerId = user?.customerId;

    if (!customerId) {
      this.errorMessage = 'Customer profile ID not found. Please log in again.';
      this.isLoading = false;
      this.cd.detectChanges();
      return;
    }

    this.isLoading = true;
    this.customerService.getCustomerProfile(customerId).subscribe({
      next: (res) => {
        if (res.success && res.profile) {
          this.profile = res.profile;
        }
        this.isLoading = false;
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load profile', err);
        this.errorMessage = 'Unable to load profile details.';
        this.isLoading = false;
        this.cd.detectChanges();
      }
    });
  }

  openEditModal(): void {
    if (!this.profile) return;
    this.editForm = {
      firstName: this.profile.firstName,
      lastName: this.profile.lastName,
      mobile: this.profile.mobile,
      age: this.profile.age,
      employmentType: this.profile.employmentType,
      monthlyIncome: this.profile.monthlyIncome,
      monthlyInvestment: this.profile.monthlyInvestment
    };
    this.showEditModal = true;
  }

  closeEditModal(): void {
    this.showEditModal = false;
  }

  saveProfile(): void {
    if (!this.profile) return;

    const current = this.profile;
    const customerId = current.customerId || this.authService.getUser()?.customerId || 1;

    const updatePayload = {
      firstName: this.editForm.firstName || current.firstName,
      lastName: this.editForm.lastName || current.lastName,
      mobile: this.editForm.mobile || current.mobile,
      age: Number(this.editForm.age ?? current.age),
      employmentType: this.editForm.employmentType || current.employmentType,
      monthlyIncome: Number(this.editForm.monthlyIncome ?? current.monthlyIncome),
      monthlyInvestment: Number(this.editForm.monthlyInvestment ?? current.monthlyInvestment)
    };

    this.isSaving = true;

    this.customerService.updateCustomerProfile(customerId, updatePayload).subscribe({
      next: () => {
        this.isSaving = false;
        this.showEditModal = false;

        this.profile = {
          ...current,
          ...updatePayload
        };

        const currentUser = this.authService.getUser();
        if (currentUser) {
          currentUser.fullName = `${updatePayload.firstName} ${updatePayload.lastName}`;
          localStorage.setItem('user', JSON.stringify(currentUser));
        }

        this.cd.detectChanges();
      },
      error: (err) => {
        this.isSaving = false;
        alert(err.error?.message || 'Failed to update profile in database.');
        this.cd.detectChanges();
      }
    });
  }
}
