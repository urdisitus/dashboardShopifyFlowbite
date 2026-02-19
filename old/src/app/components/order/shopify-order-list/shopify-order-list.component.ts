import { Component, Injectable, Input, OnInit } from '@angular/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { List } from 'linqts';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

export interface ColumnDef {
  name: string;
  title?: string;
  custom?: boolean;
}

export interface DataBag {
  id?: string;
  name?: string;
  class?: string;
  enabled?: boolean;
}

// Depending on whether rollup is used, moment needs to be imported differently.
// Since Moment.js doesn't have a default export, we normally need to import using the `* as`
// syntax. However, rollup creates a synthetic default module and we thus need to import it using
// the `default as` syntax.
import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import { defaultFormat as _rollupMoment } from 'moment';
import { IShopifyCollectionPageDto, IShopifyOrderSimpleDto } from 'src/app/dataTransferObjects/order/order';
import { ApiOrderService } from 'src/app/services/order/order.service';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, Observable } from 'rxjs';
import { Utils } from 'src/app/providers/utils';

const moment = _rollupMoment || _moment;

// See the Moment.js docs for the meaning of these formats:
// https://momentjs.com/docs/#/displaying/format/
export const MY_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
};



@Component({
  selector: 'app-shopify-order-list',
  templateUrl: './shopify-order-list.component.html',
  styleUrls: ['./shopify-order-list.component.css'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class ShopifyOrderListComponent implements OnInit {

  @Input() shopKey: string;

  columns: ColumnDef[] = [
    {
      name: 'check',
      title: '',
      custom: true
    },
    {
      name: 'actions',
      title: 'Acciones',
      custom: true
    },
    {
      name: 'orderNumber',
      title: 'Orden',
      custom: true
    },
    {
      name: 'createdAt',
      title: 'Fecha',
      custom: true
    },
    {
      name: 'customerName',
      title: 'Cliente'
    },
    {
      name: 'totalPrice',
      title: 'Monto Total'
    },
    {
      name: 'saleOrderId',
      title: 'Sincronizada',
      custom: true
    }
  ];

  now: Date = new Date();
  listParam: any = {
    limit: '100',
    extName: '',
    noSaleOrderId: null,
    loadMore: true
  };

  noSaleOrders = [
    {
      id: 'all',
      name: 'Todas'
    },
    {
      id: '1',
      name: 'No Sincronizadas'
    },
    {
      id: '0',
      name: 'Solo sincronizadas'
    }
  ]

  listResponseDto: IShopifyCollectionPageDto<IShopifyOrderSimpleDto> = {};
  dataSource: ShopifyOrderListDataSource;
  displayedColumns: string[] = this.columnList().Select(x => x.name).ToArray();
  autoColumns: ColumnDef[] = this.columnList().Where(x => !x.custom).ToArray();

  columnList(): List<ColumnDef> {
    return new List<ColumnDef>(this.columns);
  }

  public tipoFacturacion: number;

  constructor(
    private _toastr: ToastrService,
    private apiOrderService: ApiOrderService,
    private _modalService: NgbModal) {
  }

  ngOnInit() {
    this.dataSource = new ShopifyOrderListDataSource(this.apiOrderService, this.shopKey);
    this.reload();

  }

  dataList(): List<IShopifyOrderSimpleDto> {
    return new List<IShopifyOrderSimpleDto>(this.dataSource.data);
  }

  reload() {
    this.cleanData();
    this.fetchNext();
  }

  cleanData() {
    this.listParam.loadMore = true;
    this.dataSource.data = [];
    this.dataSource.nextPageInfo = null;
    this.listResponseDto = {
      data: []
    };
  }

  fetchNext() {
    this.listParam.pageInfo = this.listResponseDto.nextPageInfo;
    if (this.listParam.extName) {
      this.listParam.noSaleOrderId = 'all';
    }
    this.dataSource.orders({
      noSaleOrderId: (this.listParam.noSaleOrderId === 'all' || this.listParam.noSaleOrderId == null) ? null : this.listParam.noSaleOrderId === '1' ? true : false,
      limit: this.listParam.limit,
      extName: this.listParam.extName
    }).then((response: IShopifyCollectionPageDto<IShopifyOrderSimpleDto>) => {
      this.listResponseDto = response;
      if (!response.nextPageInfo) {
        this.listParam.loadMore = false;
      }
    });
  }

  dateToString(date: Date): string {
    if (!date) {
      return '';
    }
    return _moment(date).format('YYYY-MM-DD');
  }

  keyPress(event: KeyboardEvent) {
    const pattern = /[0-9]/;
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      // invalid character, prevent input
      event.preventDefault();
    }
  }

  updateOrder(result: IShopifyOrderSimpleDto, id: number) {
    let tmpData = [];
    this.dataSource.data.forEach(element => {
      if (element.id === id) {
        if (result) {
          tmpData.push(result);
        }
      } else {
        tmpData.push(element);
      }
    });
    this.dataSource.data = tmpData;
    this.dataSource.updateData();
  }

  checkAllCheckBox(ev) {
    if (this.dataSource.data) {
      this.dataSource.data.forEach(x => {
        x.bSelected = ev.target.saleOrderId == null && ev.target.checked;
      });
    }
  }

  checkCheckBox(ev, element: IShopifyOrderSimpleDto) {
    element.bSelected = ev.target.checked;
  }

  getCheckBoxChecked(): IShopifyOrderSimpleDto[] {
    if (this.dataSource.data) {
      return new List<IShopifyOrderSimpleDto>(this.dataSource.data)
        .Where(x => x.bSelected === true).ToArray();
    }
    return [];
  }

  anyToCheck(): boolean {

    return this.dataSource.data.some(p => p.saleOrderId == null);
  }

  anyChecked(): boolean {
    return this.dataSource.data.some(p => p.bSelected);
  }

  isAllCheckBoxChecked() {
    if (this.dataSource.data) {
      return this.dataSource.data.every(p => p.bSelected);
    }
    return false;
  }

  sync(element: IShopifyOrderSimpleDto) {
    Utils.confirm(
      '¿Desea sincronizar la orden seleccionada?',
      () => {
        this.apiOrderService.Sync(this.shopKey, [element.id.toString()]).then((result: boolean) => {
          this._toastr.success('Se realizó la sincronización con éxito.', 'Confirmación');
          element.saleOrderId = 100;
        });
      }
    );
  }

  resetearSeleccionados() {
    const selected = this.getCheckBoxChecked();
    if (selected && selected.length > 0) {
      Utils.confirm(
        '¿Desea sincronizar las ordenes seleccionadass?',
        () => {
          this.apiOrderService.Sync(this.shopKey, new List<IShopifyOrderSimpleDto>(selected)
            .Select(x => x.id.toString()).ToArray()).then((result: boolean) => {
              this._toastr.success('Se realizó la sincronización con éxito.', 'Confirmación');
              selected.forEach(element => {
                element.saleOrderId = 100;
              });
            });
        }
      );
    }
  }
}

@Injectable()
export class ShopifyOrderListDataSource implements DataSource<IShopifyOrderSimpleDto> {
  private subject = new BehaviorSubject<IShopifyOrderSimpleDto[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();
  public data: IShopifyOrderSimpleDto[] = [];
  public nextPageInfo: string;

  constructor(
    private _service: ApiOrderService,
    private _shopKey: string) {
  }

  orders(param: any): Promise<IShopifyCollectionPageDto<IShopifyOrderSimpleDto>> {
    return new Promise((resolve) => {
      this.loadingSubject.next(true);
      param.pageInfo = this.nextPageInfo;
      this._service.GetShopifyOrders(this._shopKey, param).then((result: IShopifyCollectionPageDto<IShopifyOrderSimpleDto>) => {
        this.nextPageInfo = result.nextPageInfo;
        result.data.forEach(element => {
          this.data.push(element);
        });
        this.updateData();
        this.loadingSubject.next(false);
        resolve(result);
      }).catch(() => {
        this.loadingSubject.next(false);
      });
    });
  }

  updateData() {
    this.subject.next(this.data);
  }

  connect(collectionViewer: CollectionViewer): Observable<IShopifyOrderSimpleDto[]> {
    return this.subject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.subject.complete();
    this.loadingSubject.complete();
  }
}
