import { Injectable, ErrorHandler } from '@angular/core';


export class AppErrorHandler implements ErrorHandler {
  handleError(error: any): void {
    //alert('jakaś wielka dupa');
    console.log(error);
  }

  constructor() { }

}
