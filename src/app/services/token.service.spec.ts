import { TestBed, inject } from "@angular/core/testing";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { ToastMakeModule } from "app/other-modules/toast-make/toast-make.module";
import { ToastMakeService } from "app/other-modules/toast-make/toast-make.service";

import { TokenService } from "./token.service";

describe("TokenService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ToastMakeModule, MatSnackBarModule],
      providers: [TokenService, ToastMakeService],
    });
  });

  it("should be created", inject([TokenService], (service: TokenService) => {
    expect(service).toBeTruthy();
  }));
});
