import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EmiPaymentService } from '../emi-payment-service';

declare var Razorpay: any;

@Component({
  selector: 'app-emi-pay',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './emi-pay.html',
  styleUrl: './emi-pay.scss'
})
export class EmiPay implements OnInit {
  emiDetails: any = null;
  showDetails = false;

  private platformId = inject(PLATFORM_ID);

  constructor(
    private route: ActivatedRoute,
    private service: EmiPaymentService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.route.paramMap.subscribe((params) => {
      const id = Number(params.get('emiScheduleId'));
      if (id) {
        this.getEmiDetails(id);
      }
    });
  }

  getEmiDetails(id: number): void {
    this.service.getEmiDetails(id).subscribe({
      next: (res) => {
        this.emiDetails = res;
        console.log('EMI Details:', res);
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('EMI API Error:', err);
      }
    });
  }

  viewDetails(): void {
    this.showDetails = !this.showDetails;
  }

  payNow(): void {
    if (!this.emiDetails) {
      alert('EMI details are not loaded.');
      return;
    }

    const id = this.emiDetails.emiScheduleId;

    this.service.createPaymentOrder(id).subscribe({
      next: (res) => {
        const options = {
          key: 'rzp_test_Kl7588Yie2yJTV',
          name: 'GoLoan',
          description: 'EMI Payment',
          order_id: res.orderId,

          handler: (response: any) => {
            const paymentData = {
              emiScheduleId: id,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature
            };

            this.service.verifyPayment(paymentData).subscribe({
              next: () => {
                alert('EMI payment successful!');
              },
              error: (err) => {
                alert('Payment verification failed.');
              }
            });
          },

          prefill: {},
          theme: {
            color: '#3399cc'
          }
        };

        const razorpay = new Razorpay(options);
        razorpay.open();
      },

      error: (err) => {
        console.error('Create payment order error:', err);
        alert('Unable to create payment order.');
      }
    });
  }
}
