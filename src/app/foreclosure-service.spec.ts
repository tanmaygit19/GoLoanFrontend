import { TestBed } from '@angular/core/testing';
import { ForeclosureService } from './foreclosure-service';

describe('ForeclosureService', () => {
  let service: ForeclosureService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ForeclosureService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
