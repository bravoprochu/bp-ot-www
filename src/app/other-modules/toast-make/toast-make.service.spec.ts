import { TestBed } from "@angular/core/testing";
import { MatSnackBarModule } from "@angular/material/snack-bar";

import { ToastMakeService } from "./toast-make.service";

describe("ToastMakeService", () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [MatSnackBarModule],
    })
  );

  it("should be created", () => {
    const service: ToastMakeService = TestBed.get(ToastMakeService);
    expect(service).toBeTruthy();
  });
});
