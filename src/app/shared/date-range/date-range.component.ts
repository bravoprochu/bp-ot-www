import { Component, Input, EventEmitter, OnInit, Output } from '@angular/core';
import * as moment from 'moment';
import { FormControl } from '@angular/forms/';
import { IDateRange } from 'app/shared/interfaces/i-date-range';
import { CommonFunctionsService } from 'app/services/common-functions.service';
import { MomentCommonService } from '@bpShared/moment-common/moment-common.service';

@Component({
  selector: 'app-date-range',
  templateUrl: './date-range.component.html',
  styleUrls: ['./date-range.component.css']
})
export class DateRangeComponent implements OnInit {
@Input() dateRange: IDateRange;
@Output() onGo:EventEmitter<IDateRange>=new EventEmitter();
@Output() isActive:EventEmitter<boolean>=new EventEmitter();

  constructor(
    private momentService: MomentCommonService) { }


  dateFrom:FormControl;
  dateTo:FormControl;
  showDateRange:boolean;

  ngOnInit() {
    this.showDateRange=false;
    this. dateRange? this.dateRange: <IDateRange>{};
    // this.dateFrom=new FormControl(moment(this.dateRange.dateStart).isValid() && this.dateRange.dateStart ? moment(this.dateRange.dateStart).format(): moment().subtract(3,"month").format());
    // this.dateTo=new FormControl(moment(this.dateRange.dateEnd).isValid()? moment(this.dateRange.dateEnd).format(): moment().format());

    this.dateFrom= new FormControl(this.momentService.getToday().subtract(3, "months"));
    this.dateTo=new FormControl(this.momentService.getToday());

  }


  dateRangeIsActive()
  {
    this.showDateRange=!this.showDateRange; 
    this.isActive.emit(this.showDateRange);
  }

  go()
  {
    let res:IDateRange=<IDateRange>{
      dateStart: this.dateFrom.value,
      dateEnd: this.dateTo.value
    }
    this.onGo.emit(res);
    //this.showDateRange=false;
    this.dateRangeIsActive();
    //this.isActive.emit(this.showDateRange);
  }
}
