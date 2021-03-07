import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceBuyPaymentRemindComponent } from './invoice-buy-payment-remind.component';

describe('InvoiceBuyPaymentRemindComponent', () => {
  let component: InvoiceBuyPaymentRemindComponent;
  let fixture: ComponentFixture<InvoiceBuyPaymentRemindComponent>;

  beforeEach(async(() => {
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
