import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LmsReportsDashboard } from './lms-reports-dashboard';

describe('LmsReportsDashboard', () => {
  let component: LmsReportsDashboard;
  let fixture: ComponentFixture<LmsReportsDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LmsReportsDashboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LmsReportsDashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
