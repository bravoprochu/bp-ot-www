import { KeyValue } from "@angular/common";
import { Injectable } from "@angular/core";
import { IDateRange } from "@bpCommonInterfaces/i-date-range";

type DateRangeEntry = KeyValue<string, IDateRange>;

@Injectable({
  providedIn: "root",
})
export class NavListService {
  dateRanges = [] as DateRangeEntry[];
  searchString = [] as KeyValue<string, string>[];

  constructor() {}

  getDateRange(searchKey: string): DateRangeEntry {
    return this.dateRanges.find(
      (f) => f.key.toLowerCase() === searchKey.toLowerCase()
    );
  }

  setDateRange(key: string, dateRange: IDateRange): void {
    const FOUND = this.getDateRange(key);
    if (FOUND) {
      FOUND.value = dateRange;
    } else {
      const NEW_DATE_RANGE_ENTRY = {
        key,
        value: dateRange,
      } as DateRangeEntry;
      this.dateRanges.push(NEW_DATE_RANGE_ENTRY);
    }
  }
}
