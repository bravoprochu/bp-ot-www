import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DialogTakNieComponent } from "./components/dialog-tak-nie/dialog-tak-nie.component";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule } from "@angular/material/dialog";
import { FlexLayoutModule } from "@angular/flex-layout";
import { DialogConfirmationsService } from "./services/dialog-confirmations.service";
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
  MAT_NATIVE_DATE_FORMATS,
} from "@angular/material/core";
import { DialogDateConfirmationComponent } from "./components/dialog-date-confirmation/dialog-date-confirmation";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { ReactiveFormsModule } from "@angular/forms";
import { Platform } from "@angular/cdk/platform";
import { CustomDateAdapterPl } from "app/common-functions/angular-datepicker/custom-date-adapter-pl";

const IMPORT_EXPORT_MODULES = [
  FlexLayoutModule,
  MatButtonModule,
  MatDatepickerModule,
  MatDialogModule,
  MatFormFieldModule,
  MatInputModule,
  ReactiveFormsModule,
];

@NgModule({
  declarations: [DialogTakNieComponent, DialogDateConfirmationComponent],
  exports: [
    IMPORT_EXPORT_MODULES,
    DialogTakNieComponent,
    DialogDateConfirmationComponent,
  ],
  imports: [CommonModule, IMPORT_EXPORT_MODULES],
  providers: [
    DialogConfirmationsService,
    { provide: MAT_DATE_LOCALE, useValue: "pl-PL" },
    {
      provide: DateAdapter,
      useClass: CustomDateAdapterPl,
      deps: [MAT_DATE_LOCALE, Platform],
    },
    { provide: MAT_DATE_FORMATS, useValue: MAT_NATIVE_DATE_FORMATS },
  ],
})
export class DialogConfirmationsModule {}
