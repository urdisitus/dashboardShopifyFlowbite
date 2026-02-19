import { Component, OnInit, ViewChild, Input, Output, EventEmitter, ViewChildren, QueryList } from '@angular/core';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { SearchableService } from 'src/app/services/generic/impl/searchable.service';
import { DataTableDirective } from 'angular-datatables';

@Component({
  selector: 'app-selector-searchable',
  templateUrl: './selector-searchable.component.html',
  styleUrls: ['./selector-searchable.component.css']
})
export class SelectorSearchableComponent<TEntity> implements OnInit {
  @ViewChild('content') content: any;

  @Input() public dtElement: DataTableDirective;
  @Input() public select: any;
  @Input() public searchable: SearchableService<TEntity>;
  @Output() onSelected = new EventEmitter<string[]>();

  public selected: string[] = [];
  public param: any = {};

  constructor(
    public config: NgbModalConfig,
    private modalService: NgbModal) {
    config.backdrop = 'static';
    config.keyboard = false;
  }

  ngOnInit() {
    if (this.searchable) {
      this.searchable.dtOptions["select"] = this.select;
    }
  }

  open(selected: string[]) {
    if (selected) {
      this.selected = selected;
    }
    this.modalService.open(this.content, {
      size: 'lg'
    });
    this.search(selected);
  }

  close(modal) {
    modal.dismiss('Cross click');
  }

  search(selected: string[] = null) {
    if (this.searchable) {
      if (this.dtElement) {                
        this.processSelected().then(() => {          
          if(!selected){
            selected = this.selected;          
          }          
          this.searchable.search(this.param).then((items: TEntity[]) => {
            this.searchable.rerender(this.dtElement.dtInstance);
            setTimeout(()=>{
              this.makeSelected(selected);
            }, 200);          
          }).catch(() => {
            this.searchable.rerender(this.dtElement.dtInstance);
          });
        });
      }
    }
  }

  makeSelected(selected: string[]) {
    if (selected) {
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        for (let index = 0; index < dtInstance.rows().data().length; index++) {
          const element = dtInstance.row(index).data()[0];
          if(selected.indexOf(element) > -1){
            dtInstance.row(index)['select']();
          }else{
            dtInstance.row(index)['deselect']();
          }        
        }
        dtInstance.draw(true);
      });
    }
    this.selected = selected;
  }

  processSelected(): Promise<void> {
    return new Promise<void>((resolve) => {
      this.selected = [];
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        for (let index = 0; index < dtInstance.rows({ selected: true }).data().length; index++) {
          const element = dtInstance.rows({ selected: true }).data()[index][0];
          this.selected.push(element);
        }
        resolve();
      });
    });
  }

  accept(modal) {
    this.processSelected().then(() => {
      this.close(modal);
      this.onSelected.emit(this.selected);
    });
  }
}
