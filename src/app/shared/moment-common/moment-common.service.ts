import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { DEFAULT_APP_VALUES } from 'environments/environment';
import { IDateRange } from '@bpCommonInterfaces/i-date-range';


@Injectable()
export class MomentCommonService {

  constructor() { }

  convertToConstTime(date: any): moment.Moment{
    let res = undefined;
    if(moment(date).isValid()){
      res=moment(date);
      this.setConstTimeMoment(res);
      return moment(res);
    } else {
      res = moment();
      this.setConstTimeMoment(res);
      return moment(res);
    }
  }

  convertToMoment(date: string){
    let d= moment(date);
    return d.isValid? d: moment();
  }

  getTodayConstTimeFormated(): string {
    let todayConstTime = moment();
    this.setConstTimeMoment(todayConstTime);
    return todayConstTime.format(DEFAULT_APP_VALUES.dateLocalFormat);
  }

  getToday(): moment.Moment{
    //return moment();
    let res=moment();
    this.setConstTimeMoment(res);
    return res;
  }

  getTodayFormated(): string{
    return this.getFormatedDate();
  }

  getPreviousMonth():IDateRange{
    return {
      dateStart: this.getToday().subtract(1, 'month').date(1).hour(0).minute(0).millisecond(0),
      dateEnd: moment(moment().date(1)).subtract(1, 'day').hour(23).minute(59).millisecond(999)
    } as IDateRange
  }

  getNow():moment.Moment{
    return moment();
  }

  getNowFormated(): string{
    return this.getNow().format(`${DEFAULT_APP_VALUES.dateLocalFormat}THH:mm:ss`);
  }

  getTodayConstTimeMoment():moment.Moment{
    let res=this.getToday()
    this.setConstTimeMoment(res);
    return res;
  }



  getFormatedDate(date?: moment.Moment): string {
    return date ? date.format(DEFAULT_APP_VALUES.dateLocalFormat) : this.getToday().format(DEFAULT_APP_VALUES.dateLocalFormat);
  }

  isCurrencyNbpValidDate(date: moment.Moment): moment.Moment {
    if (date instanceof moment) {

      let hourBefor: number = 13;
      let format = DEFAULT_APP_VALUES.dateLocalFormat;
      let today = moment().format(format);
      let calDate = date.format(format);

      //date is greater than today
      if (calDate > today) {
        date = date.subtract(date.diff(moment(), "day"), "day");
      }
      //calendar date is today, and its before 13:00 (nbp emits new rates)
      if (calDate == today && date.hour() < hourBefor) {
        date = date.subtract(1, "day");
      }
      //it is weekend day
      if (date.day() == 0 || date.day() == 6) {
        date = date.day() == 0 ? date.subtract(2, "day") : date.subtract(1, "day");
      }
    }
    return date;
  }

  isDate(val: any):boolean {
    return moment.isDate(new Date(val));
  }

  setConstTimeMoment(date: moment.Moment, hour?: number): void {
    //date = date ? moment(date) : moment();
    hour = hour ? hour : DEFAULT_APP_VALUES.defaultConstHour;

    date.set({
      hour:hour,
      hours:hour,
      minute:0,
      minutes:0,
      second:0,
      seconds:0,
      millisecond:0,
      milliseconds:0
    });

    // console.log('date', date.toLocaleString());

    // let res=moment();

    // if(date){
    //   res.year(date.year());
    //   res.month(date.month());
    //   res.day(date.day());
    //   console.log('is date !', date.toLocaleString());
    // }

    // res.hour(hour);
    // console.log('hour', res);
    // res.minute(0);
    // res.second(0);
    // res.millisecond(0);
    // console.log('hour', res.toLocaleString());
    // console.log('res setConstTime',res.toLocaleString());
    // return res;
  }
}
