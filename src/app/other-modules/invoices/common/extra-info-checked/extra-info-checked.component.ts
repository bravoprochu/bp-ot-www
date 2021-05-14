import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Component, OnInit, Input, OnDestroy } from "@angular/core";
import { startWith, takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import { DateTimeCommonServiceService } from "app/other-modules/date-time-common/services/date-time-common-service.service";

@Component({
  selector: "app-extra-info-checked",
  templateUrl: "./extra-info-checked.component.html",
  styleUrls: ["./extra-info-checked.component.css"],
})
export class ExtraInfoCheckedComponent implements OnInit, OnDestroy {
  @Input() rForm: FormGroup; //formExtraInfocheckedGroup
  @Input() placeholder: string;
  isDestroyed$ = new Subject() as Subject<boolean>;

  constructor(private dateTimeService: DateTimeCommonServiceService) {}

  ngOnDestroy(): void {
    this.isDestroyed$.next(true);
    this.isDestroyed$.complete();
    this.isDestroyed$.unsubscribe();
  }

  ngOnInit() {
    this.initForm();
  }

  get checked(): FormControl {
    return <FormControl>this.rForm?.get("checked");
  }

  get date(): FormControl {
    return <FormControl>this.rForm?.get("date");
  }
  get info(): FormControl {
    return <FormControl>this.rForm?.get("info");
  }

  initForm() {
    this.rForm
      ?.get("checked")
      .valueChanges.pipe(startWith(false), takeUntil(this.isDestroyed$))
      .subscribe((s: boolean) => {
        if (s === true) {
          this.date.setValidators(Validators.required);
          if (this.date.value == null) {
            this.date.setValue(this.dateTimeService.getToday());
          }
        } else {
          this.date.clearValidators();
        }
        this.date.updateValueAndValidity();
      });
  }
}
