import { TestBed } from '@angular/core/testing';
import { EmiPaymentService } from './emi-payment-service';

describe('EmiPaymentService', () => {
  let service: EmiPaymentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmiPaymentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
