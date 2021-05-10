import { FormControl } from "@angular/forms";
import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { IDateRange } from "app/shared/interfaces/i-date-range";
import { OnDestroy } from "@angular/core";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { DateTimeCommonServiceService } from "app/other-modules/date-time-common/services/date-time-common-service.service";

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
  @Input() dateRange?: IDateRange;
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

  constructor(private dateTimeService: DateTimeCommonServiceService) {}

  ngOnDestroy(): void {
    this.isDestroyed$.next(true);
    this.isDestroyed$.complete();
    this.isDestroyed$.unsubscribe();
  }

  ngOnInit() {
    this.isDestroyed$ = new Subject<boolean>();
    this.search$ = new FormControl();
    if (this.dateRange === undefined) {
      this.dateRangeIsUndefined = true;
      this.showDateRange = false;
      this.dateRange = this.dateTimeService.getRangeActiveMonth();
    } else {
      this.showDateRange = true;
    }
    this.updateZakresInfo();
    this.showCreate = true;
    this.showSearch = true;

    this.search$.valueChanges
      .pipe(takeUntil(this.isDestroyed$))
      .subscribe((s) => {
        this.onSearch.emit(s);
        this.infoSearchFilter = s == "" ? "" : "[TextFilter] ";
      });
  }

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
    const DATE_START = this.dateTimeService.formatYYYYMMDD(
      this.dateRange.dateStart
    );
    const DATE_END = this.dateTimeService.formatYYYYMMDD(
      this.dateRange.dateEnd
    );
    this.zakresInfo = `od ${DATE_START} do ${DATE_END}`;
  }
}
