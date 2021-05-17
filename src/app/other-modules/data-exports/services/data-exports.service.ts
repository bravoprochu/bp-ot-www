import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class DataExportsService {
  constructor() {}

  csvConverter(data: any[], tableHeaders: string[]): string {
    if (Array.isArray(data) && data.length > 1) {
      let firstLine: string = "";
      let end = ";";
      let lineEnd = "\r\n";
      let result: string = "";

      //
      // header
      //

      firstLine = tableHeaders.join(end) + lineEnd;

      //
      // loop
      //

      data.forEach((row) => {
        tableHeaders.forEach((header) => {
          let v: string;
          if (row[header] == null) {
            v = "";
          } else {
            v = row[header];
          }
          result += v + end;
        });
        result += lineEnd;
      });

      return firstLine + result;
    }
    return;
  }
}
