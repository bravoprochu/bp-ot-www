import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatDialog } from "@angular/material/dialog";
import { ContractorService } from "../../services/contractor.service";

import { CompanyCardComponent } from "./company-card.component";

describe("CompanyCardComponent", () => {
  let component: CompanyCardComponent;
  let fixture: ComponentFixture<CompanyCardComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [CompanyCardComponent],
        imports: [MatAutocompleteModule],
        providers: [
          { provide: MatDialog, useValue: {} },
          { provide: ContractorService, useValue: {} },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should be created", () => {
    expect(component).toBeTruthy();
  });
});
