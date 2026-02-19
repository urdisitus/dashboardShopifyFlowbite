import { NgBlockUI, BlockUI } from 'ng-block-ui';
import { Utils } from 'src/app/providers/utils';
import { IEnableService } from '../IEnableService';

export class EnableService<TKey, TEntity> {

  @BlockUI() blockUI: NgBlockUI;

  constructor(
    private service: IEnableService<TKey, TEntity>) {

  }

  enable(id: TKey, text: string = null): Promise<TEntity> {
    return new Promise<TEntity>((resolve, error) => {
      Utils.confirm(
        `¿Esta seguro que desea habilitar ${text?`a "${text}"`: 'el registro seleccionado'}?`,
        () => {
          this.blockUI.start('Habilitando registro...'); // Start blocking
          return this.service.enable(id).then((item: TEntity) => {
            this.blockUI.stop(); // Stop blocking
            resolve(item);
          }).catch(reason=>{
            this.blockUI.stop(); // Stop blocking
            error(reason);
          });
        });
    });
  }
}
