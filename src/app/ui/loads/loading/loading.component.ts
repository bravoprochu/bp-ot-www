import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from "@angular/forms";
import { ILoadingPlace } from "app/shared/interfaces/iloading-place";
import { IGeo } from "app/shared/interfaces/igeo";
import * as moment from "moment";

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css']
})
export class LoadingComponent implements OnInit {
  @Input() formGroup:FormGroup;
    

  constructor() { }

  ngOnInit() {
    let loading_date=this.formGroup.get('loading_date');
    if(loading_date.value==null){
    }
  };
}
