import { OnInit, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { DeleteableService } from 'src/app/services/generic/impl/deleteable.service';
import { EnableService } from 'src/app/services/generic/impl/enable.service';
import { DisableService } from 'src/app/services/generic/impl/disable.service';
import { StoreService } from 'src/app/services/generic/impl/store.service';
import { GetByKeyService } from 'src/app/services/generic/impl/getbyky.service';
import { FormModalOptions, FormModalComponent } from 'src/app/components/generic/crud/form-modal/form-modal.component';
import { ICrudService } from 'src/app/services/generic/ICrudService';
import { DataTableDirective } from 'angular-datatables';
import { SearchableService } from 'src/app/services/generic/impl/searchable.service';

export abstract class CrudComponentBase<TKey, TEntity> implements OnInit {
  @ViewChild('formModal') public modal: FormModalComponent<TEntity>;
  @ViewChildren(DataTableDirective)
  dtElements: QueryList<DataTableDirective>;
  //form   
  public params: any = {};
  modalOptions: FormModalOptions<TEntity>;
  //ables
  deleteableService: DeleteableService<TKey, TEntity>;
  enableService: EnableService<TKey, TEntity>;
  disableService: DisableService<TKey, TEntity>;
  getbykeyService: GetByKeyService<TKey, TEntity>;
  storeService: StoreService<TEntity>;
  listableService: SearchableService<TEntity>;

  constructor(
    protected crudService: ICrudService<TKey, TEntity>) {
    this.deleteableService = new DeleteableService<TKey, TEntity>(crudService);
    this.enableService = new EnableService<TKey, TEntity>(crudService);
    this.disableService = new DisableService<TKey, TEntity>(crudService);
    this.getbykeyService = new GetByKeyService<TKey, TEntity>(crudService);
    this.storeService = new StoreService<TEntity>(crudService);
    this.listableService = new SearchableService<TEntity>(this.crudService, () => {
      return this.params;
    });
    this.modalOptions = this.getModalOptions();
  }

  ngOnInit() {
    this.listableService.ngOnInit();
  }

  ngAfterViewInit(): void {
    this.listableService.ngAfterViewInit();
  }

  ngOnDestroy(): void {
    this.listableService.ngOnDestroy();
  }

  listAll() {
    this.dtElements.forEach((dtElement: DataTableDirective, index: number) => {
      if(dtElement.dtInstance){
        dtElement.dtInstance.then((dtInstance: any) => {
          if (this.dtElements.length == 1 || dtInstance.table().node().id == this.getTableId()) {
            this.listableService.search(this.params).then((items: TEntity[]) => {
              this.listableService.rerender(dtElement.dtInstance);
            }).catch(() => {
              this.listableService.rerender(dtElement.dtInstance);
            });
          }
        });
      }      
    });
  }

  listAllThen(item: TEntity) {
    this.listAll();
  }

  enable(item: TEntity) {
    this.enableService.enable(this.getKey(item), this.getText(item)).then(() => {
      this.listAll();
    });
  }

  disable(item: TEntity) {
    this.disableService.disable(this.getKey(item), this.getText(item)).then(() => {
      this.listAll();
    });
  }

  delete(item: TEntity) {
    this.deleteableService.delete(this.getKey(item), this.getText(item)).then(() => {
      this.listAll();
    });
  }

  getTableId(): string{
    return "";
  }
  abstract getKey(item: TEntity): TKey;
  abstract getText(item: TEntity): string;
  abstract getModalOptions(): FormModalOptions<TEntity>;
}
