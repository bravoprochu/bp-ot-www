import { Component, Input, EventEmitter, OnInit, Output } from "@angular/core";
import { FormControl } from "@angular/forms/";
import { DateTimeCommonServiceService } from "app/other-modules/date-time-common/services/date-time-common-service.service";
import { IDateRange } from "app/shared/interfaces/i-date-range";

@Component({
  selector: "app-date-range",
  templateUrl: "./date-range.component.html",
  styleUrls: ["./date-range.component.css"],
})
export class DateRangeComponent implements OnInit {
  @Input() dateRange = this.dateTimeService.getRangeLastQuarter() as IDateRange;
  @Output() onGo = new EventEmitter<IDateRange>();
  @Output() isActive = new EventEmitter<boolean>();
  dateFrom = new FormControl(this.dateRange.dateStart);
  dateTo = new FormControl(this.dateRange.dateEnd);
  showDateRange = false;

  constructor(private dateTimeService: DateTimeCommonServiceService) {}

  ngOnInit(): void {}

  dateRangeIsActive(): void {
    this.showDateRange = !this.showDateRange;
    this.isActive.emit(this.showDateRange);
  }

  go(): void {
    let res: IDateRange = <IDateRange>{
      dateStart: this.dateFrom.value,
      dateEnd: this.dateTo.value,
    };
    this.onGo.emit(res);
    this.dateRangeIsActive();
  }
}
