import { ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ForeclosureService } from '../foreclosure-service';

declare var Razorpay: any;

@Component({
  selector: 'app-foreclosure-payment',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './foreclosure-payment.html',
  styleUrl: './foreclosure-payment.scss'
})
export class ForeclosurePayment {

  requestId: number;
  request: any;

  constructor(private route: ActivatedRoute, private service: ForeclosureService, private cd: ChangeDetectorRef) {
    this.requestId = Number(this.route.snapshot.paramMap.get('requestId'));

    this.service.getRequest().subscribe({
      next: (data: any[]) => {
        this.request = data.find(x => x.requestId === this.requestId);
        this.cd.detectChanges();
      },
      error: err => {
        console.error(err)
      }
    });
  }

  payNow(): void {
    if (!this.request || this.request.status !== 'Approved' || this.request.isPaid) {
      alert('Request is not approved or already paid');
      return;
    }

    this.service.createPaymentOrder(this.requestId).subscribe({
      next: (res: any) => {
        const options = {
          key: 'rzp_test_Kl7588Yie2yJTV',
          order_id: res.orderId ?? res.OrderId,
          name: 'GoLoan',

          handler: (payment: any) => {
            const data = {
              requestId: this.requestId,
              razorpayOrderId: payment.razorpay_order_id,
              razorpayPaymentId: payment.razorpay_payment_id,
              razorpaySignature: payment.razorpay_signature
            };

            this.service.verifyPayment(data).subscribe({
              next: () => {
                this.request.status = 'Completed';
                this.request.isPaid = true;
                alert('Payment successful!');
                this.cd.detectChanges();
              },
              error: err => {
                console.error(err);
                alert('Payment verification failed');
              }
            });
          }
        };

        const razorpay = new Razorpay(options);

        razorpay.on('payment.failed', () => {
          alert('Payment failed. Please try again.');
        });

        razorpay.open();
      },
      error: err => {
        console.error(err);
        alert('Unable to create payment order');
      }
    });
  }
}