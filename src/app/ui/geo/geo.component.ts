import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from "@angular/forms";
import { IGeo } from "app/shared/interfaces/igeo";

@Component({
  selector: 'app-geo',
  templateUrl: './geo.component.html',
  styleUrls: ['./geo.component.css']
})
export class GeoComponent implements OnInit {
@Input() formGroup: FormGroup;

  constructor() { }

  ngOnInit() {
  }

}
