import { Routes } from '@angular/router';

// Foreclosure / payments
import { LoanOfficerClosure } from './loan-officer-closure/loan-officer-closure';
import { LoanOfficerforeclosure } from './loan-officerforeclosure/loan-officerforeclosure';
import { ForeclosurePayment } from './foreclosure-payment/foreclosure-payment';
import { Foreclosure } from './foreclosure/foreclosure';
import { EmiPay } from './emi-pay/emi-pay';
import { Paybtn } from './paybtn/paybtn';
import { PaymentHistory } from './payment-history/payment-history';

// Authentication pages
import { Login } from './pages/auth/login/login';
import { Register } from './pages/auth/register/register';
import { TwoFactor } from './pages/auth/two-factor/two-factor';

// Layout
import { MainLayout } from './layout/main-layout/main-layout';

// Core Dashboard and Modules
import { Dashboard } from './pages/dashboard/dashboard';
import { CustomerProfile } from './pages/customer-profile/customer-profile';
import { KycVerification } from './pages/kyc-verification/kyc-verification';
import { OfficerCustomers } from './pages/officer-customers/officer-customers';
import { OfficerKyc } from './pages/officer-kyc/officer-kyc';
import { ModulePage } from './pages/module-page/module-page';

// Teammate Components
import { Cibil } from './cibil/cibil';
import { Scorecard } from './scorecard/scorecard';
import { Eligibility } from './eligibility/eligibility';
import { Applyloan } from './applyloan/applyloan';
import { Pendingdeals } from './pendingdeals/pendingdeals';
import { Sanctionletter } from './sanctionletter/sanctionletter';
import { Loanaccount } from './loanaccount/loanaccount';
import { LoanaccountDetails } from './loanaccount-details/loanaccount-details';
import { Emischedule } from './emischedule/emischedule';
import { Notification } from './notification/notification';

// Authentication guard
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // Default redirect
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  // Authentication
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

  // Protected application layout (Sidebar + Topbar)
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

      // Customer services
      { path: 'module/cibil', component: Cibil },
      { path: 'module/scorecards', component: Scorecard },
      { path: 'module/eligibility', component: Eligibility },
      { path: 'module/eligibility-result', component: Eligibility },
      { path: 'module/apply-loan', component: Applyloan },
      { path: 'module/applications', component: Pendingdeals },
      { path: 'module/track-status', component: Pendingdeals },
      { path: 'module/letters', component: Sanctionletter },
      { path: 'module/accounts', component: Loanaccount },
      { path: 'module/loanaccount-details/:id', component: LoanaccountDetails },
      { path: 'module/emi-schedule', component: Emischedule },
      { path: 'module/notifications', component: Notification },

      // Connected Foreclosure & Closure Routes
      { path: 'module/foreclosure-request', component: Foreclosure },
      { path: 'module/closure-requests', component: LoanOfficerClosure },
      { path: 'module/foreclosure', component: LoanOfficerforeclosure },

      // Connected Payment Routes
      { path: 'module/payment-history', component: PaymentHistory },
      { path: 'module/make-payments', component: Emischedule },
      { path: 'module/emi-pay/:emiScheduleId', component: EmiPay },
      { path: 'module/foreclosure-payment/:requestId', component: ForeclosurePayment },

      // Direct / alias URLs inside layout
      { path: 'foreclosure', component: LoanOfficerforeclosure },
      { path: 'closure', component: LoanOfficerClosure },
      { path: 'fore', component: Foreclosure },
      { path: 'payment', component: PaymentHistory },
      { path: 'cibil', component: Cibil },
      { path: 'scorecard', component: Scorecard },
      { path: 'eligibility', component: Eligibility },
      { path: 'applyloan', component: Applyloan },
      { path: 'pendingdeals', component: Pendingdeals },
      { path: 'sanctionletter', component: Sanctionletter },
      { path: 'loanacc', component: Loanaccount },
      { path: 'loanaccount', component: Loanaccount },
      { path: 'loanaccount-details/:id', component: LoanaccountDetails },
      { path: 'emischedule', component: Emischedule },
      { path: 'notification', component: Notification },

      // Fallback for modules not yet created (must stay last)
      { path: 'module/:id', component: ModulePage }
    ]
  },

  // Fallback direct payment links if opened outside layout
  { path: 'foreclosure-payment/:requestId', component: ForeclosurePayment },
  { path: 'emi-pay/:emiScheduleId', component: EmiPay },
  { path: 'btn', component: Paybtn }
];
