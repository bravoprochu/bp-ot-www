import { Observable } from 'rxjs/Rx';
import { ILoad } from '../../../shared/interfaces/iload';
import { LoadService } from './load.service';
export class LoadDataTableSource {
/**
 *
 */
constructor(
    private df:LoadService
) {}

    connect():Observable<ILoad[]>
    {
        return this.df.getAll()
        .take(1);
    }


    disconnect(){}


}
