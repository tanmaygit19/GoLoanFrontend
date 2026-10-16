import { Routes } from '@angular/router';

// Authentication pages
import { Login } from './pages/auth/login/login';
import { Register } from './pages/auth/register/register';
import { TwoFactor } from './pages/auth/two-factor/two-factor';

// Layout
import { MainLayout } from './layout/main-layout/main-layout';

// Dashboard and modules
import { Dashboard } from './pages/dashboard/dashboard';
import { CustomerProfile } from './pages/customer-profile/customer-profile';
import { KycVerification } from './pages/kyc-verification/kyc-verification';
import { OfficerCustomers } from './pages/officer-customers/officer-customers';
import { OfficerKyc } from './pages/officer-kyc/officer-kyc';
import { ModulePage } from './pages/module-page/module-page';

// Authentication guard
import { authGuard } from './core/guards/auth.guard';

// Main branch routes
import { Cibil } from './cibil/cibil';
import { Scorecard } from './scorecard/scorecard';
import { Eligibility } from './eligibility/eligibility';

export const routes: Routes = [
  // Default route
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },

  // Public routes
  {
    path: 'login',
    component: Login
  },
  {
    path: 'register',
    component: Register
  },
  {
    path: 'two-factor',
    component: TwoFactor
  },

  // Protected application layout
  {
    path: '',
    component: MainLayout,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        component: Dashboard
      },
      {
        path: 'module/profile',
        component: CustomerProfile
      },
      {
        path: 'module/kyc-verification',
        component: KycVerification
      },
      {
        path: 'module/customers',
        component: OfficerCustomers
      },
      {
        path: 'module/kyc',
        component: OfficerKyc
      },
      {
        path: 'module/:id',
        component: ModulePage
      }
    ]
  },

  // Main branch routes
  {
    path: 'cibil',
    component: Cibil
  },
  {
    path: 'scorecard',
    component: Scorecard
  },
  {
    path: 'eligibility',
    component: Eligibility
  },

  // Unknown routes
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];