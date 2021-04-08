import { HttpClientModule } from "@angular/common/http";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { DialogConfirmationsModule } from "app/other-modules/dialog-confirmations/dialog-confirmations.module";
import { TokenService } from "app/services/token.service";
import { UsersManagementService } from "app/services/users-management/users-management.service";
import { of } from "rxjs";

import { UsersManagementComponent } from "./users-management.component";

describe("UsersManagementComponent", () => {
  let component: UsersManagementComponent;
  let fixture: ComponentFixture<UsersManagementComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [UsersManagementComponent],
        imports: [
          DialogConfirmationsModule,
          HttpClientModule,
          MatSnackBarModule,
        ],
        providers: [UsersManagementService, TokenService],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
