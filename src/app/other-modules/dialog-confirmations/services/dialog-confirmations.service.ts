import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { IDialogTakNie } from "app/other-modules/dialog-confirmations/interfaces/i-dialog-tak-nie";
import { Observable } from "rxjs";
import { DialogDateConfirmationComponent } from "../components/dialog-date-confirmation/dialog-date-confirmation";
import { DialogTakNieComponent } from "../components/dialog-tak-nie/dialog-tak-nie.component";
import { IDialogDateConfirmation } from "../interfaces/i-dialog-date-confirmation";
import { IDialogDateConfirmationReturn } from "../interfaces/i-dialog-date-confirmation-return";

@Injectable({
  providedIn: "root",
})
export class DialogConfirmationsService {
  constructor(private dialog: MatDialog) {}

  getTakNieDialog(data: IDialogTakNie): Observable<boolean> {
    return this.dialog
      .open(DialogTakNieComponent, {
        data,
      })
      .afterClosed();
  }

  getDateConfirmationDialog(
    data: IDialogDateConfirmation
  ): Observable<IDialogDateConfirmationReturn | null> {
    return this.dialog
      .open(DialogDateConfirmationComponent, { data })
      .afterClosed();
  }
}
