import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { MatButtonModule } from "@angular/material/button";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { DateRangeComponent } from "./date-range.component";

describe("DateRangeComponent", () => {
  let component: DateRangeComponent;
  let fixture: ComponentFixture<DateRangeComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [DateRangeComponent],
        imports: [
          MatButtonModule,
          MatDatepickerModule,
          MatFormFieldModule,
          MatInputModule,
        ],
        providers: [],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(DateRangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
