import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmiCollection } from './emi-collection';

describe('EmiCollection', () => {
  let component: EmiCollection;
  let fixture: ComponentFixture<EmiCollection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmiCollection]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmiCollection);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
