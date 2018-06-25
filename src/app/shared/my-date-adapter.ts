import { format } from 'util';
import { NativeDateAdapter } from "@angular/material";

export class MyDateAdapter extends NativeDateAdapter {
    getFirstDayOfWeek():number{
        return 1;
    }

    // format(date: Date, displayFormat: Object):string{
    //     if(displayFormat==='input'){
    //         const day=date.getDate();
    //         const month=date.getMonth();
    //         const year=date.getFullYear();
    //         return `${day}.${month}.${year}`
    //     } else{
    //         return date.toDateString();
    //     }
    // }
  


}



