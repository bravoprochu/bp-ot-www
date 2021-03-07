import { take } from "rxjs/operators";
import { Observable } from "rxjs";
import { ILoad } from "../../../shared/interfaces/iload";
import { LoadService } from "./load.service";
export class LoadDataTableSource {
  /**
   *
   */
  constructor(private df: LoadService) {}

  connect(): Observable<ILoad[]> {
    return this.df.getAll().pipe(take(1));
  }

  disconnect() {}
}
