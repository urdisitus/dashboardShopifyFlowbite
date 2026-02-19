import { NgBlockUI, BlockUI } from 'ng-block-ui';
import { Utils } from 'src/app/providers/utils';
import { IDisableService } from '../IDisableService';

export class DisableService<TKey, TEntity> {

  @BlockUI() blockUI: NgBlockUI;

  constructor(
    private service: IDisableService<TKey, TEntity>) {

  }

  disable(id: TKey, text: string = null): Promise<TEntity> {
    return new Promise<TEntity>((resolve, error) => {
      Utils.confirm(
        `¿Esta seguro que desea desabilitar ${text?`a "${text}"`: 'el registro seleccionado'}?`,
        () => {
          this.blockUI.start('Desabilitando registro...'); // Start blocking
          return this.service.disable(id).then((item: TEntity) => {
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
