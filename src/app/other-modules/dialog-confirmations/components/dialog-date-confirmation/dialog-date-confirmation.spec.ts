import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { DialogDateConfirmationComponent } from "./dialog-date-confirmation";

describe("PaymentRemindDialogComponent", () => {
  let component: DialogDateConfirmationComponent;
  let fixture: ComponentFixture<DialogDateConfirmationComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [DialogDateConfirmationComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogDateConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
