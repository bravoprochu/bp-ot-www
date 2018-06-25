import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import * as moment from 'moment';

@Component({
  selector: 'app-payment-remind-dialog',
  templateUrl: './payment-remind-dialog.component.html',
  styleUrls: ['./payment-remind-dialog.component.css']
})
export class PaymentRemindDialogComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<PaymentRemindDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data:any
  ) { }

  ngOnInit() {
    this.data.paymentDate= moment().format();
  }

  onNoClick(){
    this.dialogRef.close();
  }
  onYesClick()
  {
    this.dialogRef.close(moment(this.data.paymentDate).format());
  }

}
