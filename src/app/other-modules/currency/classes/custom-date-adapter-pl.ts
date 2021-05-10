import { NativeDateAdapter } from "@angular/material/core";

export class CustomDateAdapterPl extends NativeDateAdapter {
  getFirstDayOfWeek(): number {
    return 1;
  }
}
