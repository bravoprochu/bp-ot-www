import { FormGroup, FormControl } from "@angular/forms";
import { Component, Input, OnInit, OnDestroy } from "@angular/core";

@Component({
  selector: "app-invoice-pos-resume",
  templateUrl: "./invoice-pos-resume.component.html",
  styleUrls: ["./invoice-pos-resume.component.css"],
})
export class InvoicePosResumeComponent implements OnInit, OnDestroy {
  @Input() rForm?: FormGroup; //formInvoice
  @Input() isCorrection = new FormControl(false);

  constructor() {}

  ngOnDestroy(): void {
    this.isAlive = false;
  }

  ngOnInit() {}

  isAlive: boolean = true;

  get corrections(): FormGroup {
    return this.rForm?.get("corrections") as FormGroup;
  }

  get current(): FormGroup {
    return this.rForm?.get("current") as FormGroup;
  }

  get original(): FormGroup {
    return this.rForm?.get("original") as FormGroup;
  }
}
