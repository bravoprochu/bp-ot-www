import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.css']
})
export class MainMenuComponent implements OnInit {
  @Output() change= new EventEmitter();
  @Input() icon:string;
  constructor() { 
  }

  isOpened:boolean;
  selectedIcon: string
  

  ngOnInit() {
    this.selectedIcon=this.icon;
  }

  open(){
    this.isOpened=!this.isOpened;
    this.selectedIcon=this.isOpened? 'close': this.icon;
    this.change.emit();
  }

}
