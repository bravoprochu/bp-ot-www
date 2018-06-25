import { environment } from '../../../environments/environment';
import { tick } from '@angular/core/testing';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";

@Component({
  selector: 'app-dialog-tak-nie',
  templateUrl: './dialog-tak-nie.component.html',
  styleUrls: ['./dialog-tak-nie.component.css']
})
export class DialogTakNieComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DialogTakNieComponent>,
    @Inject(MAT_DIALOG_DATA) private data:any
  
  ) { }
  
  ngOnInit() {
    this.title=this.data.title || environment.appName;
    this.question=this.data.question || 'Czy na pewno ?';
  }

  title:string;
  question: string;

  close(val:string){
    val=='tak'? this.dialogRef.close(true): this.dialogRef.close(false);
  }


}
