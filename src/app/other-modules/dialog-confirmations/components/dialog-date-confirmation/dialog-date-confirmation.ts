import { Component, OnInit, Inject } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { IDialogDateConfirmation } from "../../interfaces/i-dialog-date-confirmation";
import { IDialogDateConfirmationReturn } from "../../interfaces/i-dialog-date-confirmation-return";

@Component({
  selector: "app-payment-remind-dialog",
  templateUrl: "./dialog-date-confirmation.html",
  styleUrls: ["./dialog-date-confirmation.css"],
})
export class DialogDateConfirmationComponent implements OnInit {
  rForm$?: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<DialogDateConfirmationComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: IDialogDateConfirmation
  ) {}

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.rForm$ = this.fb.group({
      info: [null],
      paymentDate: [new Date(), Validators.required],
    });
  }

  onNoClick() {
    this.dialogRef.close();
  }

  onYesClick() {
    if (this.rForm$.valid) {
      this.dialogRef.close(this.rForm$.value as IDialogDateConfirmationReturn);
    }
  }

  get paymentDate(): FormControl {
    return this.rForm$.get("paymentDate") as FormControl;
  }
}
