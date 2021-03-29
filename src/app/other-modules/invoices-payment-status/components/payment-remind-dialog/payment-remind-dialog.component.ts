import { Component, OnInit, Inject } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { IInvoicesPaymentStatusConfirmDialogData } from "../../interfaces/i-invoices-payment-status-confirm-dialog-data";
import { IInvoicesPaymentStatusConfirmDialogDataReturn } from "../../interfaces/i-invoices-payment-status-confirm-dialog-data-return";

@Component({
  selector: "app-payment-remind-dialog",
  templateUrl: "./payment-remind-dialog.component.html",
  styleUrls: ["./payment-remind-dialog.component.css"],
})
export class PaymentRemindDialogComponent implements OnInit {
  rForm$ = {} as FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<PaymentRemindDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: IInvoicesPaymentStatusConfirmDialogData
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
      this.dialogRef.close(
        this.rForm$.value as IInvoicesPaymentStatusConfirmDialogDataReturn
      );
    }
  }

  get paymentDate(): FormControl {
    return this.rForm$.get("paymentDate") as FormControl;
  }
}
