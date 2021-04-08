import { DragDropModule } from "@angular/cdk/drag-drop";
import { HttpClientModule } from "@angular/common/http";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { MomentDateModule } from "@angular/material-moment-adapter";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { DialogConfirmationsModule } from "app/other-modules/dialog-confirmations/dialog-confirmations.module";
import { DialogConfirmationsService } from "app/other-modules/dialog-confirmations/services/dialog-confirmations.service";
import { MomentCommonService } from "app/other-modules/moment-common/services/moment-common.service";
import { ToastMakeModule } from "app/other-modules/toast-make/toast-make.module";
import { ToastMakeService } from "app/other-modules/toast-make/toast-make.service";
import { TokenService } from "app/services/token.service";
import { InvoiceSellGroupCloneService } from "../../services/invoice-sell-group-clone.service";

import { InvoiceSellGroupCloneComponent } from "./invoice-sell-group-clone.component";

describe("InvoiceSellGroupCloneComponent", () => {
  let component: InvoiceSellGroupCloneComponent;
  let fixture: ComponentFixture<InvoiceSellGroupCloneComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [InvoiceSellGroupCloneComponent],
        imports: [
          BrowserAnimationsModule,
          DragDropModule,
          DialogConfirmationsModule,
          HttpClientModule,
          ToastMakeModule,
          MomentDateModule,
        ],
        providers: [
          DialogConfirmationsService,
          InvoiceSellGroupCloneService,
          ToastMakeService,
          TokenService,
          MomentCommonService,
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceSellGroupCloneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
