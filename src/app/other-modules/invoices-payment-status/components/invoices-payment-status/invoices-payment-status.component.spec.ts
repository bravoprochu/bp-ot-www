import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoicesPaymentStatusComponent } from './invoices-payment-status.component';

describe('InvoicesPaymentStatusComponent', () => {
  let component: InvoicesPaymentStatusComponent;
  let fixture: ComponentFixture<InvoicesPaymentStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvoicesPaymentStatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoicesPaymentStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
