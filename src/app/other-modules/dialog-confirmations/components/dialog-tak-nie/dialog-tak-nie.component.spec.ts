import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";

import { DialogTakNieComponent } from "./dialog-tak-nie.component";

describe("DialogTakNieComponent", () => {
  let component: DialogTakNieComponent;
  let fixture: ComponentFixture<DialogTakNieComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [DialogTakNieComponent],
        providers: [
          { provide: MatDialog, useValue: {} },
          {
            provide: MatDialogRef,
            useValue: {},
          },
          {
            provide: MAT_DIALOG_DATA,
            useValue: {},
          },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogTakNieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should be created", () => {
    expect(component).toBeTruthy();
  });
});
