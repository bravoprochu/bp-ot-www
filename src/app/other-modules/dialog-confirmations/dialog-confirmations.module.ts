import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DialogTakNieComponent } from "./components/dialog-tak-nie/dialog-tak-nie.component";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule } from "@angular/material/dialog";
import { FlexLayoutModule } from "@angular/flex-layout";
import { DialogConfirmationsService } from "./services/dialog-confirmations.service";
import { MAT_DATE_LOCALE } from "@angular/material/core";
import {
  MatMomentDateModule,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from "@angular/material-moment-adapter";
import { DialogDateConfirmationComponent } from "./components/dialog-date-confirmation/dialog-date-confirmation";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { ReactiveFormsModule } from "@angular/forms";

const IMPORT_EXPORT_MODULES = [
  FlexLayoutModule,
  MatButtonModule,
  MatDatepickerModule,
  MatDialogModule,
  MatFormFieldModule,
  MatInputModule,
  MatMomentDateModule,
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
    { provide: MAT_DATE_LOCALE, useValue: "pl-PL" },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
    DialogConfirmationsService,
  ],
})
export class DialogConfirmations {}
