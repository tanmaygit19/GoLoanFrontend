import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ForeclosureService {

    http=inject(HttpClient);

    url="https://localhost:7074/api/ForeClosure/GetReq";

    getRequest(){
       return this.http.get<any>(this.url);
    }


    url2='https://localhost:7074/api/ForeClosure/GetReqForAdmin';


    getRequestsForAdmin() {
     return this.http.get<any>(this.url2);
}


url3='https://localhost:7074/api/ForeClosure/Approve';

approveRequest(requestId: number){
  return this.http.put<any>(`${this.url3}/${requestId}`,{}, {responseType: 'text'});
}


url4 = 'https://localhost:7074/api/ForeClosure/Reject';

rejectRequest(requestId: number){
  return this.http.put<any>(`${this.url4}/${requestId}`,{}, { responseType: 'text'});
}


url5= 'https://localhost:7074/api/LoanAccount';

getLoanAccounts(){
  return this.http.get<any>(this.url5);
}

url6='https://localhost:7074/api/ForeClosure/AddR';

addRequest(request:any){
  return this.http.post(this.url6,request,{responseType:'text'});
}

url7='https://localhost:7074/api/ForeClosure/GetAllClosureRequests';

getClosureRequest(){
  return this.http.get<any>(this.url7);
}

url8 = 'https://localhost:7074/api/ForeClosure/CreatePaymentOrder';

createPaymentOrder(requestId: number) {
  return this.http.post<any>(`${this.url8}/${requestId}`,{});
}

url9 = 'https://localhost:7074/api/ForeClosure/Payment';

verifyPayment(paymentData: any) {
  return this.http.post<any>(this.url9, paymentData);
}

}
