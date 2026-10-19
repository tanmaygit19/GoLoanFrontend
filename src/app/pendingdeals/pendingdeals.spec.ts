
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Pendingdeals } from './pendingdeals';

describe('Pendingdeals', () => {
  let component: Pendingdeals;
  let fixture: ComponentFixture<Pendingdeals>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Pendingdeals],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Pendingdeals);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    fixture?.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
