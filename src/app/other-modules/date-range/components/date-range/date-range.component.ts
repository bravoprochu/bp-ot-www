import { Component, Input, EventEmitter, OnInit, Output } from "@angular/core";
import { FormControl } from "@angular/forms/";
import { MomentCommonService } from "app/other-modules/moment-common/services/moment-common.service";
import { IDateRange } from "app/shared/interfaces/i-date-range";

@Component({
  selector: "app-date-range",
  templateUrl: "./date-range.component.html",
  styleUrls: ["./date-range.component.css"],
})
export class DateRangeComponent implements OnInit {
  @Input() dateRange = this.momentService.getPreviousMonth() as IDateRange;
  @Output() onGo = new EventEmitter<IDateRange>();
  @Output() isActive = new EventEmitter<boolean>();
  dateFrom = new FormControl(
    this.momentService.getToday().subtract(3, "months")
  );
  dateTo = new FormControl(this.momentService.getToday());
  showDateRange = false;

  constructor(private momentService: MomentCommonService) {}

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
