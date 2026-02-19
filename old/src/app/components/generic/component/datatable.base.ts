import { Component, ViewChild, OnInit, Input } from '@angular/core';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material';
import { NgbActiveModal, NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';



@Component({
  selector: 'table-modal-confirm',
  template: `
  <div class="modal-header bg-warning">
    <h4 class="modal-title modal-header-text-warning">{{title}}</h4>
    <button type="button" class="close" aria-describedby="modal-title" (click)="modal.dismiss('Cross click')">
      <span aria-hidden="true">&times;</span>
    </button>
  </div>
  <div class="modal-body">
     <p><strong>{{message}}</strong></p>
  </div>
  <div class="modal-footer">
    <button type="button" class="btn btn-outline-secondary" (click)="modal.dismiss('cancel click')">Cancel</button>
    <button type="button" class="btn btn-warning" (click)="modal.close('Ok click')">Ok</button>
  </div>
  `
})
export class TableModalConfirmacion {
  @Input()
  public title: string;

  @Input()
  public message: string;
  constructor(public modal: NgbActiveModal) { }
}

const spanishRangeLabel = (page: number, pageSize: number, length: number) => {
  if (length == 0 || pageSize == 0) { return `0 de ${length}`; }

  length = Math.max(length, 0);

  const startIndex = page * pageSize;

  // If the start index exceeds the list length, do not try and fix the end index to the end.
  const endIndex = startIndex < length ?
    Math.min(startIndex + pageSize, length) :
    startIndex + pageSize;

  return `${startIndex + 1} - ${endIndex} de ${length}`;
}

export abstract class DatatableBase<TDataSource>{


  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public dataSource = new MatTableDataSource<TDataSource>();

  public refModal: NgbModalRef;


  constructor(public _modalService: NgbModal) {

  }

  public inicializador(): void {

    var set = new MatPaginatorIntl();

    set.itemsPerPageLabel = 'Filas por página.';
    set.nextPageLabel = 'Siguiente página.';
    set.previousPageLabel = 'Página anterior';
    set.firstPageLabel = 'Ir a la primera página.';
    set.lastPageLabel = 'Ir a la última página.';
    set.getRangeLabel = spanishRangeLabel;
    this.paginator._intl = set;

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  public showModal(title: string, message: string): NgbModalRef {

    var modalRef = this._modalService.open(TableModalConfirmacion, { 
      windowClass: 'animated slideInUp',
      size: 'lg'
    })
    modalRef.componentInstance.title = title;
    modalRef.componentInstance.message = message;
    return modalRef;
  }

  public applyFilter(filterValue: string) : void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
