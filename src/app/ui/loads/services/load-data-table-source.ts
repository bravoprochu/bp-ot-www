import { Observable } from 'rxjs/Rx';
import { disconnect } from 'cluster';
import { ILoad } from '../../../shared/interfaces/iload';
import { LoadService } from './load.service';
import { DataFactoryService } from '../../../services/data-factory.service';
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
