import { Component, Input, EventEmitter, OnInit, Output } from "@angular/core";
import { FormControl } from "@angular/forms/";
import { IDateRange } from "app/shared/interfaces/i-date-range";
import { MomentCommonService } from "@bpShared/moment-common/moment-common.service";

@Component({
  selector: "app-date-range",
  templateUrl: "./date-range.component.html",
  styleUrls: ["./date-range.component.css"],
})
export class DateRangeComponent implements OnInit {
  @Input() dateRange: IDateRange;
  @Output() onGo: EventEmitter<IDateRange> = new EventEmitter();
  @Output() isActive: EventEmitter<boolean> = new EventEmitter();
  dateFrom: FormControl;
  dateTo: FormControl;
  showDateRange: boolean;

  constructor(private momentService: MomentCommonService) {}

  ngOnInit(): void {
    this.showDateRange = false;
    this.dateRange ? this.dateRange : <IDateRange>{};
    this.dateFrom = new FormControl(
      this.momentService.getToday().subtract(3, "months")
    );
    this.dateTo = new FormControl(this.momentService.getToday());
  }

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
