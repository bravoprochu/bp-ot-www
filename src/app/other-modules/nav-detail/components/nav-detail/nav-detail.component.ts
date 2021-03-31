import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from "@angular/core";
import { FormGroup } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { INavDetailInfo } from "app/shared/interfaces/inav-detail-info";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { Location } from "@angular/common";
import { DialogConfirmationsService } from "app/other-modules/dialog-confirmations/services/dialog-confirmations.service";
import { IDialogConfTakNieInfo } from "@bpCommonInterfaces/idialog-tak-nie-info";

@Component({
  selector: "app-nav-detail",
  templateUrl: "./nav-detail.component.html",
  styleUrls: ["./nav-detail.component.css"],
})
export class NavDetailComponent implements OnInit, OnDestroy {
  isDestroyed$ = new Subject<boolean>() as Subject<boolean>;

  @Input() dialogData?: any;
  @Input() isDisabled = false;
  @Input() rForm: FormGroup;
  @Input() public navDetailInfo: INavDetailInfo;
  @Output() navGetCode = new EventEmitter();
  @Output() navCancel = new EventEmitter();
  @Output() navDownload = new EventEmitter();
  @Output() navDelete = new EventEmitter();
  @Output() navSave = new EventEmitter();
  @Output() navDialogOk = new EventEmitter();
  @Output() navDialogCancel = new EventEmitter();

  constructor(
    private dialogConfirmationService: DialogConfirmationsService,
    private activeRoute: ActivatedRoute,
    private location: Location
  ) {}

  ngOnDestroy(): void {
    this.isDestroyed$.next(true);
    this.isDestroyed$.complete();
    this.isDestroyed$.unsubscribe();
  }

  ngOnInit() {
    this.activeRoute.paramMap
      .pipe(takeUntil(this.isDestroyed$))
      .subscribe((s) => {
        let id = +s.get("id");
      });
  }

  getCode() {
    console.log(JSON.stringify(this.rForm.value));
  }

  goBack() {
    this.location.back();
  }

  cancel() {
    this.navCancel.emit();
  }

  dialogCancel() {
    this.navDialogCancel.emit();
  }

  dialogOk() {
    this.navDialogOk.emit();
  }

  download() {
    this.navDownload.emit();
  }
  delete() {
    this.navDelete.emit();
  }

  save() {
    this.navSave.emit();
  }

  openDialog() {
    const data = {} as IDialogConfTakNieInfo;
    this.dialogConfirmationService
      .getTakNieDialog(data)
      .pipe(takeUntil(this.isDestroyed$))
      .subscribe((s) => console.log(s));
  }

  get dialogKeyValid(): boolean {
    if (this.dialogData && this.dialogData["componentKeyName"]) {
      return this.rForm.get(this.dialogData["componentKeyName"]).value > 0;
    }
  }
}
