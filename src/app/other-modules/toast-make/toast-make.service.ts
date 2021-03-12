import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";

@Injectable({
  providedIn: "root",
})
export class ToastMakeService {
  constructor(private snackBar: MatSnackBar) {}

  toastMake(message: string, action: string, duration = 3000) {
    this.snackBar.open(message, action, {
      duration: duration,
      horizontalPosition: "end",
    });
  }
}
