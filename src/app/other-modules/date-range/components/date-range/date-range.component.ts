import { Component, Input, EventEmitter, OnInit, Output } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms/";
import { DateTimeCommonServiceService } from "app/other-modules/date-time-common/services/date-time-common-service.service";
import { IDateRange } from "app/shared/interfaces/i-date-range";

@Component({
  selector: "app-date-range",
  templateUrl: "./date-range.component.html",
  styleUrls: ["./date-range.component.css"],
})
export class DateRangeComponent implements OnInit {
  @Input() dateRange = this.dateTimeService.getRangeLastQuarter() as IDateRange;
  isFormReady = false;
  @Input() isFormInitiated = true;
  @Output() onGo = new EventEmitter<IDateRange>();
  @Output() isActive = new EventEmitter<boolean>();
  rForm: FormGroup;
  showDateRange = false;

  constructor(
    private fb: FormBuilder,
    private dateTimeService: DateTimeCommonServiceService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  dateRangeIsActive(): void {
    this.showDateRange = !this.showDateRange;
    this.isActive.emit(this.showDateRange);
  }

  getInitForm(): FormGroup {
    this.rForm = this.fb.group({
      dateStart: [this.dateRange.dateStart, Validators.required],
      dateEnd: [this.dateRange.dateEnd, Validators.required],
    });
    this.isFormReady = true;
    return this.rForm;
  }

  go(): void {
    if (!this.rForm.valid) {
      return;
    }
    this.onGo.emit(this.rForm.value);
    this.dateRangeIsActive();
  }

  initForm(): void {
    if (this.isFormInitiated) {
      this.getInitForm();
    }
  }

  //#region getters

  get dateStart(): FormControl {
    return this.rForm.get("dateStart") as FormControl;
  }

  get dateEnd(): FormControl {
    return this.rForm.get("dateEnd") as FormControl;
  }

  //#endregion
}
