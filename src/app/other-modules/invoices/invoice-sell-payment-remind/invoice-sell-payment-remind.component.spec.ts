import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { InvoiceSellPaymentRemindComponent } from './invoice-sell-payment-remind.component';

describe('InvoiceSellPaymentRemindComponent', () => {
  let component: InvoiceSellPaymentRemindComponent;
  let fixture: ComponentFixture<InvoiceSellPaymentRemindComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ InvoiceSellPaymentRemindComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceSellPaymentRemindComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
