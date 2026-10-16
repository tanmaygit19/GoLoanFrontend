import { Routes } from '@angular/router';
import { Applyloan } from './applyloan/applyloan';
import { Loanaccount } from './loanaccount/loanaccount';
import { Pendingdeals } from './pendingdeals/pendingdeals';
import { Sanctionletter } from './sanctionletter/sanctionletter';

export const routes: Routes = [
  { path: '', component: Applyloan },
  { path: 'loanaccount', component: Loanaccount },
  { path: 'pendingdeals', component: Pendingdeals },
  { path: 'sanctionletter', component: Sanctionletter }
];