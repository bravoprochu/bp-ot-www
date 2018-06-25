import * as moment from "moment";

export interface IDataFactoryError {
    id: number,
    errorInstance: string,
    httpStatusCode: number,
    issueTime: IDataFactoryErrorIssueTime,
    message: string[],
    parent: string,
    url: string,

}


export interface IDataFactoryErrorIssueTime {
    issue: moment.Moment
    // start: string,
    // last: string
}


export class DataFactoryErrorIssueTime implements IDataFactoryErrorIssueTime {
    constructor() {
        this.startDate = new Date();
        this.issue=moment();
    }

    addIssueTime() {
        this.lastDate = new Date();
    }
    issue: moment.Moment
    
    get start(): string {
        return this.startDate != null ? `${this.startDate.toLocaleDateString()} ${this.startDate.toLocaleTimeString()}` : null
    }
    private startDate: Date;

    get last(): string {
        return this.lastDate != null ? `${this.lastDate.toLocaleDateString()} ${this.lastDate.toLocaleTimeString()}` : null
    }
    private lastDate: Date;
    get duration(): string {
        if (this.startDate != null && this.lastDate != null) {
            let dur = moment.duration(moment(this.lastDate).diff(moment(this.startDate))).humanize();
            return dur.toString();
        }
        return null;

    }
}