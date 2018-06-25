import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentRemindDialogComponent } from './payment-remind-dialog.component';

describe('PaymentRemindDialogComponent', () => {
  let component: PaymentRemindDialogComponent;
  let fixture: ComponentFixture<PaymentRemindDialogComponent>;

  beforeEach(async(() => {
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
