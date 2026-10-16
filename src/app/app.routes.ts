import { Routes } from '@angular/router';
import { Cibil } from './cibil/cibil';
import { Scorecard } from './scorecard/scorecard';
import { Eligibility } from './eligibility/eligibility';

export const routes: Routes = [
    { path: 'cibil', component: Cibil },
    { path: 'scorecard', component: Scorecard },
    { path: 'eligibility', component: Eligibility }
];