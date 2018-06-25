import { IErrorObj } from '../interfaces/ierror-object';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-error-object',
  templateUrl: './error-object.component.html',
  styleUrls: ['./error-object.component.css']
})
export class ErrorObjectComponent implements OnInit {
@Input() errorObj:IErrorObj[];

  constructor() { }

  ngOnInit() {

    this.errorObj=this.errorObj? this.errorObj: [];
    console.log(this.errorObj);
  }

}
