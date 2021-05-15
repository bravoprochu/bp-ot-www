import { FormControl } from "@angular/forms";
import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { IDateRange } from "app/shared/interfaces/i-date-range";
import { OnDestroy } from "@angular/core";
import { Subject } from "rxjs";
import { debounceTime, distinctUntilChanged, takeUntil } from "rxjs/operators";
import { DateTimeCommonServiceService } from "app/other-modules/date-time-common/services/date-time-common-service.service";
import { NavListService } from "../../nav-list.service";

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
  componentKey = "";
  infoSearchFilter: string;
  searchIsActive: boolean;
  isCreateBtn = true;
  isDateRangeBtn = false;
  showSearch = true;

  isDestroyed$ = new Subject() as Subject<boolean>;
  search$ = new FormControl();
  zakresInfo = "";

  constructor(
    private navListService: NavListService,
    private dateTimeService: DateTimeCommonServiceService
  ) {}

  ngOnDestroy(): void {
    this.isDestroyed$.next(true);
    this.isDestroyed$.complete();
    this.isDestroyed$.unsubscribe();
  }

  ngOnInit(): void {
    this.initComponentKey();
    this.initDateRange();
    this.updateZakresInfo();
    this.initObservables();
  }

  initComponentKey(): void {
    this.componentKey = `${this.title
      .trim()
      .replace(" ", "_")
      .toLowerCase()}${this.subtitle.trim().replace(" ", "_").toLowerCase()}`;
  }

  initDateRange(): void {
    if (!this.dateRange) {
      return;
    }
    const DATE_RANGE_FOUND = this.navListService.getDateRange(
      this.componentKey
    );
    if (DATE_RANGE_FOUND) {
      this.dateRange.dateStart = DATE_RANGE_FOUND.value.dateStart;
      this.dateRange.dateEnd = DATE_RANGE_FOUND.value.dateEnd;
      this.updateZakresInfo();
    }
    this.isDateRangeBtn = true;
  }

  initObservables(): void {
    this.search$.valueChanges
      .pipe(
        debounceTime(750),
        distinctUntilChanged(),
        takeUntil(this.isDestroyed$)
      )
      .subscribe((s) => {
        this.infoSearchFilter = s === "" ? "" : "[TextFilter] ";
        this.onSearch.emit(s);
      });
  }

  click(): void {
    this.onCreate.emit();
  }

  dateRangeIsActive(isActive: boolean): void {
    this.showSearch = isActive ? false : true;
    this.isCreateBtn = isActive ? false : true;
  }

  onGo(event: IDateRange): void {
    this.dateRange.dateStart = event.dateStart;
    this.dateRange.dateEnd = event.dateEnd;
    this.navListService.setDateRange(this.componentKey, event as IDateRange);
    this.updateZakresInfo();
    this.onDateRange.emit(event);
  }

  activateSearch(): void {
    this.searchIsActive = !this.searchIsActive;
    this.isCreateBtn = this.searchIsActive ? false : true;
    this.isDateRangeBtn = this.searchIsActive ? false : true;
  }

  refresh(): void {
    this.onRefresh.emit();
  }

  searchKeyUp(searchText) {
    this.onSearch.emit(searchText);
  }

  updateZakresInfo(): void {
    if (!this.isDateRangeBtn) {
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
