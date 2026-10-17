import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PrepaymentComponent } from './prepayment';
import { LMSReportsService } from '../services/lms-reports';
import { of } from 'rxjs';

describe('PrepaymentComponent', () => {
  let component: PrepaymentComponent;
  let fixture: ComponentFixture<PrepaymentComponent>;

  const mockReportsService = {
    getPrepaymentReport: () => of({
      success: true,
      message: 'Prepayment report fetched successfully.',
      data: [
        {
          type: 'Part Payment',
          accounts: 2,
          prepaymentAmount: 150000
        }
      ]
    })
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrepaymentComponent],
      providers: [
        {
          provide: LMSReportsService,
          useValue: mockReportsService
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PrepaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should calculate total accounts', () => {
    expect(component.totalAccounts).toBe(2);
  });

  it('should calculate total prepayment amount', () => {
    expect(component.totalPrepaymentAmount).toBe(150000);
  });
});

