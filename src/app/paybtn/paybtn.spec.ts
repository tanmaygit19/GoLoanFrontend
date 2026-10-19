import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Paybtn } from './paybtn';

describe('Paybtn', () => {
  let component: Paybtn;
  let fixture: ComponentFixture<Paybtn>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Paybtn],
    }).compileComponents();

    fixture = TestBed.createComponent(Paybtn);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
