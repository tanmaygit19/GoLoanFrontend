
import { Routes } from '@angular/router';
import { Cibil } from './cibil/cibil';
import { Scorecard } from './scorecard/scorecard';
import { Eligibility } from './eligibility/eligibility';
import { LoanScorecard } from './loan-scorecard/loan-scorecard';
import { OfficerReview } from './officer-review/officer-review';

export const routes: Routes = [
  { path: 'cibil', component: Cibil },
  { path: 'scorecard', component: Scorecard },
  { path: 'loan-scorecard/:id', component: LoanScorecard },
  { path: 'eligibility', component: Eligibility },
  { path: 'officer-review', component: OfficerReview },
  { path: '', redirectTo: 'cibil', pathMatch: 'full' }
];
