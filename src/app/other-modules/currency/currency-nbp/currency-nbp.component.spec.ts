import { HttpClientModule } from "@angular/common/http";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { CurrencyCommonService } from "../currency-common.service";

import { CurrencyNbpComponent } from "./currency-nbp.component";

describe("CurrencyNbpComponent", () => {
  let component: CurrencyNbpComponent;
  let fixture: ComponentFixture<CurrencyNbpComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [CurrencyNbpComponent],
        imports: [HttpClientModule, MatDatepickerModule, ReactiveFormsModule],
        providers: [CurrencyCommonService],
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
