import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { IDialogConfTakNieInfo } from "@bpCommonInterfaces/idialog-tak-nie-info";
import { Observable } from "rxjs";
import { DialogTakNieComponent } from "../components/dialog-tak-nie/dialog-tak-nie.component";

@Injectable({
  providedIn: "root",
})
export class DialogConfirmationsService {
  constructor(private dialog: MatDialog) {}

  getTakNieDialog(data: IDialogConfTakNieInfo): Observable<boolean> {
    return this.dialog
      .open(DialogTakNieComponent, {
        data,
      })
      .afterClosed();
  }
}
