export interface IDataFactoryError {
  id: number;
  errorInstance: string;
  httpStatusCode: number;
  issueTime: IDataFactoryErrorIssueTime;
  message: string[];
  parent: string;
  url: string;
}

export interface IDataFactoryErrorIssueTime {
  issue: string;
}

export class DataFactoryErrorIssueTime implements IDataFactoryErrorIssueTime {
  issue = new Date().toISOString();
  constructor() {
    this.startDate = new Date();
  }

  addIssueTime() {
    this.lastDate = new Date();
  }

  get start(): string {
    return this.startDate != null
      ? `${this.startDate.toLocaleDateString()} ${this.startDate.toLocaleTimeString()}`
      : null;
  }
  private startDate: Date;

  get last(): string {
    return this.lastDate != null
      ? `${this.lastDate.toLocaleDateString()} ${this.lastDate.toLocaleTimeString()}`
      : null;
  }
  private lastDate: Date;
  get duration(): string {
    if (this.startDate != null && this.lastDate != null) {
      return "to implement...";
    }
    return null;
  }
}
