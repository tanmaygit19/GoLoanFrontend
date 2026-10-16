import { Routes } from '@angular/router';
import { LoanOfficerClosure } from './loan-officer-closure/loan-officer-closure';
import { LoanOfficerforeclosure } from './loan-officerforeclosure/loan-officerforeclosure';
import { ForeclosurePayment } from './foreclosure-payment/foreclosure-payment';
import { Foreclosure } from './foreclosure/foreclosure';
import { EmiPay } from './emi-pay/emi-pay';
import { Paybtn } from './paybtn/paybtn';
import { PaymentHistory } from './payment-history/payment-history';

export const routes: Routes = [
  {
    path: 'foreclosure',
    component: LoanOfficerforeclosure
  },
  {
    path: 'closure',
    component: LoanOfficerClosure
  },
  {
    path: 'fore',
    component:Foreclosure
  },
  {
 path: 'foreclosure-payment/:requestId',
 component: ForeclosurePayment
},
  {
    path: 'emi-pay/:emiScheduleId',
    component: EmiPay
  },
  {
    path:'btn',
    component:Paybtn
  },
  {
    path:'payment',
    component: PaymentHistory
  }
];
