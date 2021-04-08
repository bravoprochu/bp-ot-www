import { OnDestroy, ViewChild } from "@angular/core";
import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { Subject } from "rxjs";
import { MatSelect } from "@angular/material/select";
import { IPaymentTerm } from "../interfaces/i-payment-term";
import { PaymentTermsService } from "../services/payment-terms.service";

@Component({
  selector: "app-payment-terms",
  templateUrl: "./payment-terms.component.html",
  styleUrls: ["./payment-terms.component.css"],
})
export class PaymentTermsComponent implements OnInit, OnDestroy {
  isDestroyed$ = new Subject<boolean>();
  @Input() rForm = this.paymentTermsService.getPaymentTermsGroup(
    this.fb,
    this.isDestroyed$
  );
  @ViewChild(MatSelect) matSelect: MatSelect;

  minDate = new Date();
  paymentTermsArr: IPaymentTerm[];

  constructor(
    private paymentTermsService: PaymentTermsService,
    private fb: FormBuilder
  ) {}

  ngOnDestroy(): void {
    this.isDestroyed$.next(true);
  }

  ngOnInit() {
    this.paymentTermsArr = this.paymentTermsService.getPaymentTerms();
  }

  compareWith(obj1: IPaymentTerm, obj2: IPaymentTerm) {
    return obj2 ? obj1.paymentTermId == obj2.paymentTermId : null;
  }

  //#region rForm getters

  get formDescritpion(): FormControl {
    return this.rForm?.get("description") as FormControl;
  }

  get formDay0(): FormControl {
    return this.rForm?.get("day0") as FormControl;
  }

  get formPaymentDays(): FormControl {
    return this.rForm?.get("paymentDays") as FormControl;
  }
  get formPaymentDate(): FormControl {
    return this.rForm?.get("paymentDate") as FormControl;
  }
  get formPaymentTerm(): FormGroup {
    return this.rForm?.get("paymentTerm") as FormGroup;
  }

  get isDescription(): boolean {
    return this.rForm?.get("paymentTerm").value?.isDescription as boolean;
  }
  get isPaymentDate(): boolean {
    return this.rForm?.get("paymentTerm").value?.isPaymentDate as boolean;
  }

  get paymentTerm() {
    return this.rForm?.get("paymentTerm");
  }
  //#endregion
}
