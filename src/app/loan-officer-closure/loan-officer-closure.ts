import { ChangeDetectorRef, Component } from '@angular/core';
import { Foreclosure } from '../foreclosure/foreclosure';
import { ForeclosureService } from '../foreclosure-service';
import { CommonModule } from '@angular/common';

@Component({
  imports: [CommonModule],
  selector: 'app-loan-officer-closure',
  standalone: true,
  styleUrl: './loan-officer-closure.scss',
  templateUrl: './loan-officer-closure.html',
})
export class LoanOfficerClosure {
  constructor(private service: ForeclosureService, private cd:ChangeDetectorRef){
    this.getClosureRequest();
  }

  closureRequests:any;

  getClosureRequest(){
    this.service.getClosureRequest().subscribe({
      next: res => {
        this.closureRequests = res;
        this.cd.detectChanges();
      },
      error: err => {
        console.log(err);
      }
    });
  }
}
