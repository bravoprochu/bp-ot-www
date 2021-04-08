import { HttpClientModule } from "@angular/common/http";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { MatMomentDateModule } from "@angular/material-moment-adapter";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MomentCommonModule } from "app/other-modules/moment-common/moment-common.module";
import { MomentCommonService } from "app/other-modules/moment-common/services/moment-common.service";
import { CurrencyCommonService } from "../currency-common.service";

import { CurrencyNbpComponent } from "./currency-nbp.component";

describe("CurrencyNbpComponent", () => {
  let component: CurrencyNbpComponent;
  let fixture: ComponentFixture<CurrencyNbpComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [CurrencyNbpComponent],
        imports: [
          HttpClientModule,
          MatDatepickerModule,
          MatMomentDateModule,
          MomentCommonModule,
          ReactiveFormsModule,
        ],
        providers: [CurrencyCommonService, MomentCommonService],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrencyNbpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
