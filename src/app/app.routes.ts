import { Routes } from '@angular/router';
import { Loanaccount } from './loanaccount/loanaccount';
import { Emischedule } from './emischedule/emischedule';
import { LoanaccountDetails } from './loanaccount-details/loanaccount-details';

export const routes: Routes = [
    {path:"loanacc",component:Loanaccount},
    { path: 'emischedule', component:Emischedule},
    { path: 'loanaccount-details/:id', component: LoanaccountDetails }
];
