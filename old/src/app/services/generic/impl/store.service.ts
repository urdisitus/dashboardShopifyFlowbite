import { NgBlockUI, BlockUI } from 'ng-block-ui';
import { IStoreService } from '../IStoreableService';

export class StoreService<TEntity> {

  @BlockUI() blockUI: NgBlockUI;  

  constructor(
    private service: IStoreService<TEntity>) {

  }

  store(param: TEntity): Promise<TEntity> {
    return new Promise<TEntity>((resolve, error) => {
      this.blockUI.start('Guardando registro...'); // Start blocking
      return this.service.store(param).then((item: TEntity) => {
        this.blockUI.stop(); // Stop blocking
        resolve(item);
      }).catch(reason=>{
        this.blockUI.stop(); // Stop blocking
        error(reason);
      });
    });
  }
}
