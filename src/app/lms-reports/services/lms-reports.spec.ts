import { TestBed } from '@angular/core/testing';
import { LMSReportsService } from './lms-reports';
import { HttpClient } from '@angular/common/http';
import { provideHttpClient } from '@angular/common/http';

describe('LMSReportsService', () => {
  let service: LMSReportsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient()]
    });

    service = TestBed.inject(LMSReportsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});