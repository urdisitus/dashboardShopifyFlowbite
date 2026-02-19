import { NgBlockUI, BlockUI } from 'ng-block-ui';
import { IGetByKeyService } from '../IGetByKeyService';

export class GetByKeyService<TKey, TEntity> {

  @BlockUI() blockUI: NgBlockUI;

  constructor(
    private service: IGetByKeyService<TKey, TEntity>) {

  }

  getByKey(id: TKey): Promise<TEntity> {
    return new Promise<TEntity>((resolve, error) => {
      this.blockUI.start('Obteniendo registro...'); // Start blocking
      return this.service.getByKey(id).then((item: TEntity) => {
        this.blockUI.stop(); // Stop blocking
        resolve(item);
      }).catch(reason=>{
        this.blockUI.stop(); // Stop blocking
        error(reason);
      });
    });
  }
}
