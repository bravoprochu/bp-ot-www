import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { MatMomentDateModule } from "@angular/material-moment-adapter";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MomentCommonModule } from "app/other-modules/moment-common/moment-common.module";
import { MomentCommonService } from "app/other-modules/moment-common/services/moment-common.service";
import { PaymentTermsModule } from "../payment-terms.module";
import { PaymentTermsService } from "../services/payment-terms.service";

import { PaymentTermsComponent } from "./payment-terms.component";

describe("PaymentTermsComponent", () => {
  let component: PaymentTermsComponent;
  let fixture: ComponentFixture<PaymentTermsComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [PaymentTermsComponent],
        imports: [
          BrowserAnimationsModule,
          MatDatepickerModule,
          MatFormFieldModule,
          MatInputModule,
          MatSelectModule,
          MatMomentDateModule,
          MomentCommonModule,

          PaymentTermsModule,
          ReactiveFormsModule,
        ],
        providers: [PaymentTermsService, MomentCommonService],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentTermsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should be created", () => {
    expect(component).toBeTruthy();
  });
});
