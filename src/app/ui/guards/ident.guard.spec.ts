import { TestBed, inject, waitForAsync } from "@angular/core/testing";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { RouterModule } from "@angular/router";
import { LoginComponent } from "app/auth/login/login.component";
import { TokenService } from "app/services/token.service";

import { IdentGuard } from "./ident.guard";

describe("IdentGuard", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [MatSnackBarModule, MatDialogModule, RouterModule.forRoot([])],
      providers: [
        IdentGuard,
        TokenService,
        { provide: MatDialog, useValue: {} },
      ],
    });
  });

  it("should ...", inject([IdentGuard], (guard: IdentGuard) => {
    expect(guard).toBeTruthy();
  }));
});
