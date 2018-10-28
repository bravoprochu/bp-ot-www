import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';


@Component({
  selector: 'app-table-drag-drop-options',
  templateUrl: './table-drag-drop-options.component.html',
  styleUrls: ['./table-drag-drop-options.component.css']
})
export class TableDragDropOptionsComponent implements OnInit {
  @Input() displayedColumns: string[];
  @Output() genCsv = new EventEmitter();


  constructor() { }

  ngOnInit() {
  }


  drop(ev: CdkDragDrop<string[]>):void {
    if(ev.currentIndex==ev.previousIndex) {return;}
    moveItemInArray(this.displayedColumns, ev.previousIndex, ev.currentIndex);
  }

  genRaport(){
    this.genCsv.emit("whaaa");
  }

}
