import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from "@angular/forms";

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {
@Input() rForm:FormGroup;
@Input() dataObj: any;
  constructor() { }

  ngOnInit() {
  }

  logIt(){
    console.log("----------------------------------------------");
    console.log("==================== FORM ====================");
    console.log(this.rForm);
    // console.log("================== DataObj ==================");
    // console.log(this.dataObj);
    // console.log("----------------------------------------------");
    console.log("==============================================");
  }
}
