import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";

@Injectable({
  providedIn: "root",
})
export class ToastMakeService {
  constructor(private snackBar: MatSnackBar) {}

  toastMake(message: string, action: string) {
    this.snackBar.open(message, null, {
      duration: 3000,
      horizontalPosition: "end",
    });
  }
}
