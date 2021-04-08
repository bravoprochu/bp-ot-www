import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { RouterModule } from "@angular/router";
import { DialogConfirmationsModule } from "app/other-modules/dialog-confirmations/dialog-confirmations.module";
import { DialogConfirmationsService } from "app/other-modules/dialog-confirmations/services/dialog-confirmations.service";

import { NavDetailComponent } from "./nav-detail.component";

describe("NavDetailComponent", () => {
  let component: NavDetailComponent;
  let fixture: ComponentFixture<NavDetailComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [NavDetailComponent],
        imports: [DialogConfirmationsModule, RouterModule.forRoot([])],
        providers: [
          DialogConfirmationsService,
          { provide: MatDialog, useValue: {} },
          { provide: MatDialogRef, useValue: {} },
          { provide: MAT_DIALOG_DATA, useValue: {} },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(NavDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should be created", () => {
    expect(component).toBeTruthy();
  });
});
