import { Component, OnInit, Input } from "@angular/core";
import { FormGroup } from "@angular/forms";

@Component({
  selector: "app-geo",
  templateUrl: "./geo.component.html",
  styleUrls: ["./geo.component.css"],
})
export class GeoComponent implements OnInit {
  @Input() formGroup: FormGroup;

  constructor() {}

  ngOnInit() {}
}
