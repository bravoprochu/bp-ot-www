import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { IBasicNav } from "app/services/ibasic-nav";
import { Router } from "@angular/router";

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {
  @Output() create=new EventEmitter();
  constructor(
    private router: Router,
    ) { }

  ngOnInit() {
     
  }

  click(){
    //this.create.emit();
  }

}
