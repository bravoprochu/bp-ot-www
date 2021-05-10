import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PaymentTermsComponent } from './payment-terms.component';

describe('PaymentTermsComponent', () => {
  let component: PaymentTermsComponent;
  let fixture: ComponentFixture<PaymentTermsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PaymentTermsComponent],
      imports: [FormsModule, ReactiveFormsModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentTermsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
