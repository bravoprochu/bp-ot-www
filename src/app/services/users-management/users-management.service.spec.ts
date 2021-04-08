import { HttpClientModule } from "@angular/common/http";
import { TestBed, inject } from "@angular/core/testing";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { TokenService } from "../token.service";

import { UsersManagementService } from "./users-management.service";

describe("UsersManagementService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, MatSnackBarModule],
      providers: [UsersManagementService, TokenService],
    });
  });

  it("should be created", inject(
    [UsersManagementService],
    (service: UsersManagementService) => {
      expect(service).toBeTruthy();
    }
  ));
});
