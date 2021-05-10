import { HttpClientModule } from "@angular/common/http";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { CurrencyCommonService } from "../currency-common.service";

import { CurrencyListComponent } from "./currency-list.component";

describe("CurrencyListComponent", () => {
  let component: CurrencyListComponent;
  let fixture: ComponentFixture<CurrencyListComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [CurrencyListComponent],
        imports: [HttpClientModule],
        providers: [CurrencyCommonService],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrencyListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
