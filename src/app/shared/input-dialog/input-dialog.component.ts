import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-input-dialog',
  templateUrl: './input-dialog.component.html',
  styleUrls: ['./input-dialog.component.css']
})
export class InputDialogComponent implements OnInit {
  
  
  constructor(
    private dialogRef: MatDialogRef<InputDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
    ) { 
      this.fb=new FormBuilder();
    }

  rForm:FormGroup

  ngOnInit() {
    this.rForm=this.fb.group({
      "inputValue":[null, Validators.required]
    });
  }

  onNoClick(){
    this.dialogRef.close();
  }

  onYesClick(){
    this.dialogRef.close(this.rForm.get('inputValue').value);
  }



}
