import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";

@Component({
  selector: "app-creation-info",
  templateUrl: "./creation-info.component.html",
  styleUrls: ["./creation-info.component.css"],
})
export class CreationInfoComponent implements OnInit {
  @Input() rForm = this.fb.group({
    createdBy: [null],
    createdDateTime: [null],
    modifyBy: [null],
    modifyDateTime: [null],
  });

  constructor(private fb: FormBuilder) {}

  ngOnInit() {}

  get createdBy(): string {
    return this.rForm?.get("createdBy").value;
  }

  get createdDateTime(): string {
    return this.rForm?.get("createdDateTime").value;
  }

  get modifyBy(): string {
    return this.rForm?.get("modifyBy").value;
  }

  get modifyDateTime(): string {
    return this.rForm?.get("modifyDateTime").value;
  }
}
