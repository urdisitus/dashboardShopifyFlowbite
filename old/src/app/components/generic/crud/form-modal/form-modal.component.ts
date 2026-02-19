import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { StoreService } from 'src/app/services/generic/impl/store.service';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';

export class FormModalOptions<TEntity> {
  onPreStore?: (modal: any, item: TEntity) => boolean;
  emptyEntity?: () => TEntity;
  getCompleteItem?: (item: TEntity) => Promise<TEntity>
}

@Component({
  selector: 'app-form-modal',
  templateUrl: './form-modal.component.html',
  styleUrls: ['./form-modal.component.css']
})
export class FormModalComponent<TEntity> implements OnInit {

  @ViewChild('content') content: any;
  @Input() public options: FormModalOptions<TEntity>;
  @Input() public storeService: StoreService<TEntity>;
  @Output() onPostStore = new EventEmitter<TEntity>();
  @Output() onErrorStore = new EventEmitter<any>();
  @Output() onOpenModal = new EventEmitter<any>();


  public item: TEntity;
  public formTitle: string;

  constructor(
    public config: NgbModalConfig,
    private modalService: NgbModal) {
    config.backdrop = 'static';
    config.keyboard = false;
  }

  ngOnInit() {
    if (this.options) {
      this.item = this.options.emptyEntity();
    }
  }

  create() {
    this.formTitle = "Nueva registro";
    if (this.options) {
      this.item = this.options.emptyEntity();
    }
    if(this.onOpenModal){
      this.onOpenModal.emit();
    }
    this.modalService.open(this.content,{
      size:'lg'
    });
  }

  edit(item: TEntity) {
    let editPrivate = (element: TEntity) => {
      this.formTitle = "Editar registro";
      this.item = element;
      if(this.onOpenModal){
        this.onOpenModal.emit();
      }
      this.modalService.open(this.content,{
        size:'lg'
      });
    };
    if (this.options && this.options.getCompleteItem) {
      this.options.getCompleteItem(item).then(editPrivate);
    } else {
      editPrivate(item);
    }
  }

  close(modal) {
    modal.dismiss('Cross click');
  }

  store(modal) {
    let preventDefault = true;
    if (this.options && this.options.onPreStore) {
      preventDefault = this.options.onPreStore(modal, this.item);
    }
    if (!preventDefault) {
      return;
    }
    if (this.storeService) {
      this.storeService.store(this.item).then((item: TEntity) => {
        this.item = this.options.emptyEntity();
        this.close(modal);
        this.onPostStore.emit(item);
      }).catch((reason) => {
        this.item = this.options.emptyEntity();
        this.onErrorStore.emit(reason);
      });
    }
  }
}
