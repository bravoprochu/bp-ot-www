import { Injectable } from "@angular/core";
import { IDateRange } from "@bpCommonInterfaces/i-date-range";
import { DateTime } from "luxon";

@Injectable({
  providedIn: "root",
})
export class DateTimeCommonServiceService {
  formatFullYear = "yyyy-MM-dd"; //luxon tokens combined
  constructor() {}

  addDaysToYYYMMDD(dateYYYYMMDDFormat: string, daysToAdd: number): string {
    return DateTime.fromFormat(dateYYYYMMDDFormat, this.formatFullYear)
      .plus({ days: +daysToAdd })
      .toFormat(this.formatFullYear);
  }

  addToIsoDate(
    dateISOFormat: string,
    valueToAdd: number,
    timeType: "hours" | "days" | "months"
  ): string {
    const DATE_TIME = DateTime.fromISO(dateISOFormat).plus({
      [timeType]: valueToAdd,
    });

    const res = DATE_TIME.toISO();
    return res;
  }

  addMonthsToIsoDate(dateISOFormat: string, monthsToAdd: number): string {
    const DATE = DateTime.fromISO(dateISOFormat);
    return DATE.plus({ months: monthsToAdd }).toISO();
  }

  formatYYYYMMDD(dateISOFormat: string): string {
    const dateISO = new Date(dateISOFormat);

    const YEAR = dateISO.getFullYear();
    /**
     * getMonth() in javascript Date object is 0 base..
     *
     */
    const MONTH = `0${dateISO.getMonth() + 1}`.slice(-2);
    /**
     * otther practive to set 2 digits
     *
     */
    const DAY = `0${dateISO.getDate()}`.slice(-2);
    const DATE_YYYY_MM_DD = `${YEAR}-${MONTH}-${DAY}`;
    return DATE_YYYY_MM_DD;
  }

  formatYYYYMMDTHHMMSS(dateISOFormat: string): string {
    const dateISO = new Date(dateISOFormat);

    const YEAR = dateISO.getFullYear();
    /**
     * getMonth() in javascript Date object is 0 base..
     *
     */
    const MONTH = `0${dateISO.getMonth() + 1}`.slice(-2);
    /**
     * otther practive to set 2 digits
     *
     */
    const DAY = `0${dateISO.getDate()}`.slice(-2);
    const HOURS = `0${dateISO.getHours()}`.slice(-2);
    const MINUTES = `0${dateISO.getMinutes()}`.slice(-2);
    const SECONDS = `0${dateISO.getSeconds()}`.slice(-2);

    const DATE_YYYY_MM_DD = `${YEAR}-${MONTH}-${DAY}T${HOURS}:${MINUTES}:${SECONDS}`;
    return DATE_YYYY_MM_DD;
  }

  getToday(): string {
    return DateTime.now().startOf("day").toISO();
  }

  getRangeActiveMonth(): IDateRange {
    const FIRST_DAY_OF_MONTH = DateTime.now().startOf("month").startOf("day");

    return <IDateRange>{
      dateStart: FIRST_DAY_OF_MONTH.toISO(),
      dateEnd: DateTime.now().toISO(),
    };
  }
  getRangeLastQuarter(): IDateRange {
    const THREE_MONTHS_BACK = DateTime.now()
      .minus({ months: 3 })
      .startOf("day");
    return <IDateRange>{
      dateStart: THREE_MONTHS_BACK.toISO(),
      dateEnd: DateTime.now().toISO(),
    };
  }

  setISOTimeToMidnght(datetimeISOFormat: string): string {
    const DATE_TIME = DateTime.fromISO(datetimeISOFormat).startOf("day");
    return DATE_TIME.toISO();
  }

  startOf(
    dateTimeISOFormat: string,
    timeType: "hour" | "day" | "week"
  ): string {
    return DateTime.fromISO(dateTimeISOFormat).startOf("hour").toISO();
  }
}
