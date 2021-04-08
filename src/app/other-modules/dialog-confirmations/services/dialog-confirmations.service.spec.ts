import { TestBed } from "@angular/core/testing";
import { MatDialog } from "@angular/material/dialog";

import { DialogConfirmationsService } from "./dialog-confirmations.service";

describe("DialogConfirmationsService ", () => {
  let service: DialogConfirmationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: MatDialog, useValue: {} }],
    });
    service = TestBed.inject(DialogConfirmationsService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
