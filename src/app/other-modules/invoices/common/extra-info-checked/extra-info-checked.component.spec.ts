import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { MomentCommonService } from "app/other-modules/moment-common/services/moment-common.service";

import { ExtraInfoCheckedComponent } from "./extra-info-checked.component";

describe("ExtraInfoCheckedComponent", () => {
  let component: ExtraInfoCheckedComponent;
  let fixture: ComponentFixture<ExtraInfoCheckedComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ExtraInfoCheckedComponent],
        providers: [MomentCommonService],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtraInfoCheckedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
