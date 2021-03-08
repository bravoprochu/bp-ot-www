import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: 'app-trans-eu-password',
  templateUrl: './trans-eu-password.component.html',
  styleUrls: ['./trans-eu-password.component.css']
})
export class TransEuPasswordComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<TransEuPasswordComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
  }

  pswd:string;


  onNoClick(){
    this.dialogRef.close();
  }


}
