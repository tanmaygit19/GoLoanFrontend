import { Routes } from '@angular/router';
import { Login } from './pages/auth/login/login';
import { Register } from './pages/auth/register/register';
import { TwoFactor } from './pages/auth/two-factor/two-factor';
import { MainLayout } from './layout/main-layout/main-layout';
import { Dashboard } from './pages/dashboard/dashboard';
import { CustomerProfile } from './pages/customer-profile/customer-profile';
import { KycVerification } from './pages/kyc-verification/kyc-verification';
import { OfficerCustomers } from './pages/officer-customers/officer-customers';
import { OfficerKyc } from './pages/officer-kyc/officer-kyc';
import { ModulePage } from './pages/module-page/module-page';
import { authGuard } from './core/guards/auth.guard';

import { Loanaccount } from './loanaccount/loanaccount';
import { Emischedule } from './emischedule/emischedule';
import { LoanaccountDetails } from './loanaccount-details/loanaccount-details';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },

  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'two-factor', component: TwoFactor },

  {
    path: '',
    component: MainLayout,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: Dashboard },
      { path: 'module/profile', component: CustomerProfile },
      { path: 'module/kyc-verification', component: KycVerification },
      { path: 'module/customers', component: OfficerCustomers },
      { path: 'module/kyc', component: OfficerKyc },
      { path: 'module/:id', component: ModulePage },

      // Your loan account routes
      { path: 'loanacc', component: Loanaccount },
      { path: 'emischedule', component: Emischedule },
      { path: 'loanaccount-details/:id', component: LoanaccountDetails }
    ]
  },

  { path: '**', redirectTo: '/dashboard' }
];