import { FormControl } from "@angular/forms";
import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { IDateRange } from "app/shared/interfaces/i-date-range";
import { OnDestroy } from "@angular/core/src/metadata/lifecycle_hooks";
import { Subject } from "rxjs";
import * as moment from "moment";

@Component({
  selector: "app-nav-list",
  templateUrl: "./nav-list.component.html",
  styleUrls: ["./nav-list.component.css"],
})
export class NavListComponent implements OnInit, OnDestroy {
  @Output() onCreate = new EventEmitter();
  @Output() onDateRange = new EventEmitter();
  @Output() onSearch = new EventEmitter();
  @Output() onRefresh = new EventEmitter();
  @Input() title: string;
  @Input() subtitle: string;
  @Input() dateRange: IDateRange;

  constructor() {}

  ngOnDestroy(): void {
    this.isDestroyed$.next(true);
    this.isDestroyed$.complete();
    this.isDestroyed$.unsubscribe();
  }

  ngOnInit() {
    this.isDestroyed$ = new Subject<boolean>();
    this.search$ = new FormControl();
    if (this.dateRange == undefined) {
      this.dateRangeIsUndefined = true;
      this.showDateRange = false;
      this.dateRange = this.dateRangeActiveMonth();
    } else {
      this.showDateRange = true;
    }
    this.updateZakresInfo();
    this.showCreate = true;
    this.showSearch = true;

    this.search$.valueChanges.takeUntil(this.isDestroyed$).subscribe((s) => {
      this.onSearch.emit(s);
      this.infoSearchFilter = s == "" ? "" : "[TextFilter] ";
    });
  }

  activeRange: boolean;
  dateRangeIsUndefined: boolean;
  infoSearchFilter: string;
  searchIsActive: boolean;
  showCreate: boolean;
  showDateRange: boolean;
  showSearch: boolean;

  isDestroyed$: Subject<boolean>;
  search$: FormControl;
  zakresInfo: string;

  click() {
    this.onCreate.emit();
  }

  dateRangeIsActive(isActive) {
    this.showSearch = isActive ? false : true;
    this.showCreate = isActive ? false : true;
  }

  onGo(event) {
    this.onDateRange.emit(event);
    this.dateRange.dateStart = event.dateStart;
    this.dateRange.dateEnd = event.dateEnd;
    this.updateZakresInfo();
  }

  activateSearch() {
    this.searchIsActive = !this.searchIsActive;
    this.showCreate = this.searchIsActive ? false : true;
    if (!this.dateRangeIsUndefined) {
      this.showDateRange = this.searchIsActive ? false : true;
    }
  }

  dateLocaleFormat(): string {
    return "YYYY-MM-DD";
  }

  dateRangeActiveMonth(): IDateRange {
    return <IDateRange>{
      dateStart: moment().date(1),
      dateEnd: moment(),
    };
  }

  dateRangeLastQuarter(): IDateRange {
    return <IDateRange>{
      dateStart: moment().subtract(3, "month").date(1),
      dateEnd: moment(),
    };
  }

  refresh() {
    this.onRefresh.emit();
  }

  searchKeyUp(searchText) {
    this.onSearch.emit(searchText);
  }

  updateZakresInfo(): void {
    if (!this.showDateRange) {
      return;
    }
    this.zakresInfo = `od ${this.dateRange.dateStart.format(
      this.dateLocaleFormat()
    )} do ${this.dateRange.dateEnd.format(this.dateLocaleFormat())}`;
  }
}
