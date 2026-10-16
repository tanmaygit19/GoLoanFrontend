import { Routes } from '@angular/router';

import { CreateTicket } from './support/create-ticket/create-ticket';
import { MyTickets } from './support/my-tickets/my-tickets';
import { TicketDetails } from './support/ticket-details/ticket-details';
import { AdminTickets } from './support/admin-tickets/admin-tickets';
import { ManageResponse } from './support/manage-response/manage-response';
import { Dashboard } from './dashboard/dashboard';
import { ReportsDashboard } from './reports/reports-dashboard/reports-dashboard';
import { CibilScoreRangeComponent } from './reports/cibil-score-range/cibil-score-range';
import { ScoreCardWiseComponent } from './reports/score-card-wise/score-card-wise';
import { ProductWiseComponent } from './reports/product-wise/product-wise';
import { LMSReportsDashboardComponent } from './lms-reports/lms-reports-dashboard/lms-reports-dashboard';
import { LoanPortfolioComponent } from './lms-reports/loan-portfolio/loan-portfolio';
import { EmiCollectionComponent } from './lms-reports/emi-collection/emi-collection';
import { DisbursementComponent } from './lms-reports/disbursement/disbursement';
import { PrepaymentComponent } from './lms-reports/prepayment/prepayment';

export const routes: Routes = [
  {
    path: 'support/create-ticket',
    component: CreateTicket
  },
  {
    path: 'support/my-tickets',
    component: MyTickets
  },
  {
    path: 'support/ticket-details/:id',
    component: TicketDetails
  },
  {
    path: '',
    redirectTo: 'support/create-ticket',
    pathMatch: 'full'
  },

  {
  path: 'support/admin-tickets',
  component: AdminTickets
  },
  {
  path: 'support/manage-response/:id',
  component: ManageResponse
},
 {
  path: 'dashboard',
  component: Dashboard
  },
  {
  path: 'reports',
  component: ReportsDashboard
},
{
  path: 'reports/cibil-score-range',
  component: CibilScoreRangeComponent
},
{
  path: 'reports/score-card-wise',
  component: ScoreCardWiseComponent
},
{
  path: 'reports/product-wise',
  component: ProductWiseComponent
},
{
  path: 'lms-reports',
  component: LMSReportsDashboardComponent
},
{
  path: 'lms-reports/loan-portfolio',
  component: LoanPortfolioComponent
},
{
  path: 'lms-reports/emi-collection',
  component: EmiCollectionComponent
},
{
  path: 'lms-reports/overdue',
  loadComponent: () =>
    import('./lms-reports/overdue/overdue')
      .then(m => m.OverdueComponent)
},
{
  path: 'lms-reports/disbursement',
  component: DisbursementComponent
},
{
  path: 'lms-reports/prepayment',
  component: PrepaymentComponent
},
  {
    path: '**',
    redirectTo: 'support/create-ticket'
  }
 
];

