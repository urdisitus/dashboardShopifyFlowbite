import { SelectionModel } from "@angular/cdk/collections";
import { AfterViewInit, Component, OnInit } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { debounceTime, distinctUntilChanged, tap } from "rxjs/operators";
import { IMarketplaceCompany, IMarketplaceItemMatchCode } from "src/app/models/markeplaces.models";
import { Utils } from "src/app/providers/utils";
import { MarketplacesItemMatchCodeService } from "src/app/services/marketplaces/marketplaces.service";
import { MarketplaceItemMatchCodeListadoDataSource } from "src/app/services/marketplaces/marketplaceitem_match_code.datasource";
import { DatatableBase } from "../../generic/component/datatable.base";
import { MatDialog } from "@angular/material";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { merge, fromEvent } from "rxjs";
import { ItemMatchCodeFormComponent } from "../item_match_code_form/item_match_code_form.component";

@Component({
  selector: 'app-item-match-code-list',
  templateUrl: './item_match_code_list.component.html',
  styleUrls: ['./item_match_code_list.component.css']
})
export class ItemMatchCodeListComponent extends DatatableBase<IMarketplaceItemMatchCode> implements OnInit, AfterViewInit {
  public form = new FormGroup({
    companyId: new FormControl(null),
    code: new FormControl(null),
    extCode: new FormControl(null),
    status: new FormControl(null),
  });
  public displayedColumns: string[] = ['select', 'companyId', 'code', 'extCode', 'createDate', 'editDate', 'status', 'actions'];
  public selection = new SelectionModel<IMarketplaceItemMatchCode>(true, []);
  public initialSize: number = 20;
  public source: MarketplaceItemMatchCodeListadoDataSource;
  companies: IMarketplaceCompany[] = [{
    id: null,
    name: 'Todos'
  }];
  status = [
    {
      id: null,
      name: 'Todos',
      class: null
    }, {
      id: 0,
      name: 'Desabilitado',
      class: 'warn'
    }, {
      id: 1,
      name: 'Habilitado',
      class: 'primary'
    }];

  constructor(
    private api: MarketplacesItemMatchCodeService,
    public dialog: MatDialog,
    public _modalService: NgbModal) {
    super(_modalService);
    this.source = new MarketplaceItemMatchCodeListadoDataSource(api);
  }

  getStatusName(element) {
    var hols = this.status.find(x => x.id == element.status);
    if (hols) {
      return hols.name;
    }
    return '';
  }

  getStatusClass(element) {
    var hols = this.status.find(x => x.id == element.status);
    if (hols) {
      return hols.class;
    }
    return '';
  }

  ngOnInit() {
    this.api.getCompanies().then((result: IMarketplaceCompany[]) => {
      this.companies = [{
        id: '',
        name: 'Todos'
      }];
      result.forEach(element => this.companies.push(element));
    });
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.source.resultPage.filtered;
    return numSelected >= numRows;
  }

  isAnySelected() {
    return this.selection.selected.length > 0 && this.isAnyResult();
  }

  isAnyResult() {
    return this.source.resultPage.filtered > 0;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.source.resultPage.data.forEach(row => this.selection.select(row));
  }

  subscribeInputKeyUp(nativeElement: any) {
    fromEvent(nativeElement, 'keyup')
      .pipe(
        debounceTime(150),
        distinctUntilChanged(),
        tap(() => {
          this.paginator.pageIndex = 0;
          this.selection.clear();
          this.search();
        })
      ).subscribe();
  }

  ngAfterViewInit(): void {
    merge(this.paginator.page)
      .pipe(
        tap(() => this.search())
      ).subscribe();
    this.search();
  }

  search() {
    this.source.loadListado({
      param: {
        code: this.form.get('code').value,
        extCode: this.form.get('extCode').value,
        companyId: this.form.get('companyId').value,
        status: this.form.get('status').value,
      },
      start: this.paginator.pageIndex * this.paginator.pageSize,
      length: this.paginator.pageSize
    });
  }

  deleteSelected() {
    Utils.confirm(
      `¿Esta seguro que desea borrar los elementos seleccionados?`,
      () => {
        this.api.deleteMassive(this.selection.selected.map(x => x.id)).then(r => {
          this.search();
        });
      });
  }

  enableSelected() {
    Utils.confirm(
      `¿Esta seguro que desea habilitar los elementos seleccionados?`,
      () => {
        this.api.enableMassive(this.selection.selected.map(x => x.id)).then(r => {
          this.search();
        });
      });
  }

  statusClick(item: IMarketplaceItemMatchCode) {
    if (item.status == 0) {
      this.enable(item);
    } else if (item.status == 1) {
      this.disable(item);
    }
  }

  disableSelected() {
    Utils.confirm(
      `¿Esta seguro que desea desabilitar los elementos seleccionados?`,
      () => {
        this.api.disableMassive(this.selection.selected.map(x => x.id)).then(r => {
          this.search();
        });
      });
  }

  showForm(item: IMarketplaceItemMatchCode) {
    const dialogRef = this.dialog.open(ItemMatchCodeFormComponent, {
      data: item,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.search();
      }
    });
  }

  delete(item: IMarketplaceItemMatchCode) {
    Utils.confirm(
      `¿Esta seguro que desea eliminar el elemento seleccionado?`,
      () => {
        this.api.delete(item.id).then(r => {
          this.search();
        });
      });
  }

  enable(item: IMarketplaceItemMatchCode) {
    Utils.confirm(
      `¿Esta seguro que desea habilitar el elemento seleccionado?`,
      () => {
        this.api.enable(item.id).then(r => {
          this.search();
        });
      });
  }

  disable(item: IMarketplaceItemMatchCode) {
    Utils.confirm(
      `¿Esta seguro que desea desabilitar el elemento seleccionado?`,
      () => {
        this.api.disable(item.id).then(r => {
          this.search();
        });
      });
  }
}
