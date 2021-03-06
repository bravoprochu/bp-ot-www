import { Component, OnInit, Input } from "@angular/core";
import { FormGroup } from "@angular/forms";

@Component({
  selector: "app-address",
  templateUrl: "./address.component.html",
  styleUrls: ["./address.component.css"],
})
export class AddressComponent implements OnInit {
  @Input() formGroup: FormGroup;

  constructor() {}

  ngOnInit() {
    let country = this.formGroup.get("country");
    country.valueChanges.subscribe((s) => {
      if (s != null && s != s.toUpperCase()) {
        country.patchValue(s.toUpperCase());
      }
    });
  }
}
