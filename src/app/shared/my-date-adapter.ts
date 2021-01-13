import { format } from 'util';
import { NativeDateAdapter } from "@angular/material";

export class MyDateAdapter extends NativeDateAdapter {
    getFirstDayOfWeek():number{
        return 1;
    }
}



