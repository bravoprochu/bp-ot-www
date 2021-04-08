import { HttpClientModule } from "@angular/common/http";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { RouterModule } from "@angular/router";
import { ToastMakeService } from "app/other-modules/toast-make/toast-make.service";
import { CommonFunctionsService } from "app/services/common-functions.service";
import { of } from "rxjs";
import { LoadService } from "../services/load.service";

import { LoadListComponent } from "./load-list.component";

describe("LoadListComponent", () => {
  let component: LoadListComponent;
  let fixture: ComponentFixture<LoadListComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [LoadListComponent],
        imports: [
          HttpClientModule,
          MatSnackBarModule,
          RouterModule.forRoot([]),
        ],
        providers: [
          ToastMakeService,
          {
            provide: LoadService,
            useValue: {
              getAll: () => of({}),
            },
          },
          {
            provide: CommonFunctionsService,
            useValue: {},
          },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should be created", () => {
    expect(component).toBeTruthy();
  });
});
