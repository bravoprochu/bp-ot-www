import { Component, OnInit, Input } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { ContractorService } from "../../services/contractor.service";

@Component({
  selector: "app-address",
  templateUrl: "./address.component.html",
  styleUrls: ["./address.component.css"],
})
export class AddressComponent implements OnInit {
  @Input() formGroup = this.contractorService.formAddressGroup(this.fb);

  constructor(
    private fb: FormBuilder,
    private contractorService: ContractorService
  ) {}

  ngOnInit() {
    let country = this.formGroup.get("country");
    country?.valueChanges.subscribe((s) => {
      if (s != null && s != s.toUpperCase()) {
        country.patchValue(s.toUpperCase());
      }
    });
  }
}
