import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PaymentRemindDialogComponent } from './payment-remind-dialog.component';

describe('PaymentRemindDialogComponent', () => {
  let component: PaymentRemindDialogComponent;
  let fixture: ComponentFixture<PaymentRemindDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentRemindDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentRemindDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
