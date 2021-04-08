import { HttpClientModule } from "@angular/common/http";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { MatDialog } from "@angular/material/dialog";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ToastMakeModule } from "app/other-modules/toast-make/toast-make.module";
import { ToastMakeService } from "app/other-modules/toast-make/toast-make.service";
import { TokenService } from "app/services/token.service";
import { ContractorsModule } from "../../contractors.module";
import { ContractorService } from "../../services/contractor.service";

import { CompanyListComponent } from "./company-list.component";

describe("CompanyListComponent", () => {
  let component: CompanyListComponent;
  let fixture: ComponentFixture<CompanyListComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [CompanyListComponent],
        imports: [
          BrowserAnimationsModule,
          ContractorsModule,
          HttpClientModule,
          ToastMakeModule,
        ],
        providers: [
          ContractorService,
          ToastMakeService,
          {
            provide: MatDialog,
            useValue: {},
          },
          TokenService,
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should be created", () => {
    expect(component).toBeTruthy();
  });
});
