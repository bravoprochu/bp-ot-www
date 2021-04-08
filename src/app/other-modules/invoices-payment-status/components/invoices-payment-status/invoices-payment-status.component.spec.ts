import { ScrollingModule } from "@angular/cdk/scrolling";
import { HttpClientModule } from "@angular/common/http";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatTabsModule } from "@angular/material/tabs";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { DialogConfirmationsModule } from "app/other-modules/dialog-confirmations/dialog-confirmations.module";
import { DialogConfirmationsService } from "app/other-modules/dialog-confirmations/services/dialog-confirmations.service";
import { TokenService } from "app/services/token.service";
import { InvoicesPaymentStatusService } from "../../services/invoices-payment-status.service";
import { InvoicesPaymentStatusComponent } from "./invoices-payment-status.component";

describe("InvoicesPaymentStatusComponent", () => {
  let component: InvoicesPaymentStatusComponent;
  let fixture: ComponentFixture<InvoicesPaymentStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InvoicesPaymentStatusComponent],
      imports: [
        BrowserAnimationsModule,
        ScrollingModule,
        DialogConfirmationsModule,
        HttpClientModule,
        MatFormFieldModule,
        MatInputModule,
        MatSnackBarModule,
        MatTabsModule,
      ],
      providers: [
        DialogConfirmationsService,
        InvoicesPaymentStatusService,
        TokenService,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoicesPaymentStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
