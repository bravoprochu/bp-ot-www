import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { InvoiceBuyPaymentRemindComponent } from './invoice-buy-payment-remind.component';

describe('InvoiceBuyPaymentRemindComponent', () => {
  let component: InvoiceBuyPaymentRemindComponent;
  let fixture: ComponentFixture<InvoiceBuyPaymentRemindComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ InvoiceBuyPaymentRemindComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceBuyPaymentRemindComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
