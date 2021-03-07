import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceSellPaymentRemindComponent } from './invoice-sell-payment-remind.component';

describe('InvoiceSellPaymentRemindComponent', () => {
  let component: InvoiceSellPaymentRemindComponent;
  let fixture: ComponentFixture<InvoiceSellPaymentRemindComponent>;

  beforeEach(async(() => {
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
