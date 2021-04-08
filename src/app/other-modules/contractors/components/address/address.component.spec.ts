import { HttpClientModule } from "@angular/common/http";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { TokenService } from "app/services/token.service";
import { ContractorService } from "../../services/contractor.service";

import { AddressComponent } from "./address.component";

describe("AddressComponent", () => {
  let component: AddressComponent;
  let fixture: ComponentFixture<AddressComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [AddressComponent],
        imports: [
          BrowserAnimationsModule,
          HttpClientModule,
          MatFormFieldModule,
          MatInputModule,
          MatSnackBarModule,
          ReactiveFormsModule,
          ReactiveFormsModule,
        ],
        providers: [ContractorService, TokenService],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(AddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should be created", () => {
    expect(component).toBeTruthy();
  });
});
