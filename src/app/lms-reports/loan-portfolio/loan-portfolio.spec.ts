import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanPortfolio } from './loan-portfolio';

describe('LoanPortfolio', () => {
  let component: LoanPortfolio;
  let fixture: ComponentFixture<LoanPortfolio>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoanPortfolio]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoanPortfolio);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
