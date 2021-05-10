import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DateTimeCommonServiceService } from "./services/date-time-common-service.service";

const IMPORT_EXPORT_MODULES = [];

@NgModule({
  declarations: [],
  imports: [CommonModule],
  providers: [DateTimeCommonServiceService],
})
export class DateTimeCommonModule {}
