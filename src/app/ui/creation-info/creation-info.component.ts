import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormControl } from '@angular/forms/src/model';


@Component({
  selector: 'app-creation-info',
  templateUrl: './creation-info.component.html',
  styleUrls: ['./creation-info.component.css']
})
export class CreationInfoComponent implements OnInit {
  @Input() rForm:FormGroup

  constructor() { }

  ngOnInit() {
  }

  get createdBy():string
  {
    return this.rForm.get('createdBy').value;
  }

  get createdDateTime():string
  {
    return this.rForm.get('createdDateTime').value;
  }

  get modifyBy():string
  {
    return this.rForm.get('modifyBy').value;
  }

  get modifyDateTime():string
  {
    return this.rForm.get('modifyDateTime').value;
  }

}
