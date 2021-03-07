import { Component, Input, OnInit } from "@angular/core";
import { IErrorObj } from "app/auth/interfaces/ierror-object";

@Component({
  selector: "app-error-object",
  templateUrl: "./error-object.component.html",
  styleUrls: ["./error-object.component.css"],
})
export class ErrorObjectComponent implements OnInit {
  @Input() errorObj: IErrorObj[];

  constructor() {}

  ngOnInit() {
    this.errorObj = this.errorObj ? this.errorObj : [];
  }
}
