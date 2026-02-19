import { FormModalOptions, FormModalComponent } from 'src/app/components/generic/crud/form-modal/form-modal.component';
import { ICrudService } from 'src/app/services/generic/ICrudService';
import { IIdDescriptionEntity } from 'src/app/models/generic/IIdDescriptionEntity';
import { CrudComponentBase } from './CrudComponentBase';

export abstract class CrudIdDescriptionComponent<TKey, TEntity extends IIdDescriptionEntity<TKey>> extends CrudComponentBase<TKey, TEntity> {

  constructor(
    protected crudService: ICrudService<TKey, TEntity>) {
    super(crudService);
  }

  getKey(item:TEntity): TKey{
    return item.id;
  }

  getText(item: TEntity): string {
    return item.descripcion;
  } 

  abstract getModalOptions(): FormModalOptions<TEntity>;
}
