import { ChangeDetectorRef, Component } from '@angular/core';
import { ForeclosureService } from '../foreclosure-service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Console } from 'console';

@Component({
  imports: [CommonModule, RouterLink],
  selector: 'app-loan-officerforeclosure',
  styleUrl: './loan-officerforeclosure.scss',
  templateUrl: './loan-officerforeclosure.html',
})
export class LoanOfficerforeclosure {

   adminRequests: any;

  constructor(private service: ForeclosureService, private cd:ChangeDetectorRef)
    {
       this.getAdminRequests();
    }

    

  getAdminRequests(){
    this.service.getRequestsForAdmin().subscribe({
      next:res =>{
        this.adminRequests=res;
        this.cd.detectChanges();
      },
      error:err => {
        console.log(err);
      }
    });
  }

selectedRequest: any = null;

viewRequest(x: any) {
  this.selectedRequest = x;
}

approveRequest(x:any){
  this.service.approveRequest(x.requestId).subscribe({
    next: () =>{
      alert('Request Approves Successfully.');
      this.selectedRequest = null;
      this.getAdminRequests();
    },
    error: err => {
      console.error(err);
      alert('Something Want Wrong');
    }
  });
}

rejectRequest(x: any) {
  this.service.rejectRequest(x.requestId).subscribe({
    next: () => {
      alert('Request rejected successfully.');
      this.selectedRequest = null;
      this.getAdminRequests();
    },
    error: err => {
      console.log(err);
      alert('Something Want Wrong');
    }
  });
}
}
