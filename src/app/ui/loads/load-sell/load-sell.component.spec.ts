import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { ContractorService } from "app/other-modules/contractors/services/contractor.service";
import { CommonFunctionsService } from "app/services/common-functions.service";
import { LoadService } from "../services/load.service";

import { LoadSellComponent } from "./load-sell.component";

describe("LoadSellComponent", () => {
  let component: LoadSellComponent;
  let fixture: ComponentFixture<LoadSellComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [LoadSellComponent],
        providers: [
          { provide: CommonFunctionsService, useValue: {} },
          { provide: LoadService, useValue: {} },
          { provide: ContractorService, useValue: {} },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadSellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
