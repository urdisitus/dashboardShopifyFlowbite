import { Component, ViewChild, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ApiSucursalService } from 'src/app/services/branchOffices/sucursal.service';
import { SucursalDto } from 'src/app/dataTransferObjects/branchOffice/branchOffice';
import { Router } from '@angular/router';
import { DateAdapter, MatSelect, MAT_DATE_FORMATS, MAT_DATE_LOCALE, } from '@angular/material';
import { SessionProvider } from 'src/app/providers/session/session.provider';
import { MatTableDataSource } from '@angular/material/table';
import { DatatableBase } from '../../generic/component/datatable.base';
import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import { defaultFormat as _rollupMoment } from 'moment';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { OrderViewComponent } from '../order-view/order-view.component';
import { ApiOrderService } from '../../../services/order/order.service';
import { ListOrderParam, OrderDto } from '../../../dataTransferObjects/order/order';
import { Select2OptionData } from 'ng-select2';
import { Options } from 'select2';
import { Utils } from '../../../providers/utils';

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

const STATUS_ORDER = [
  { id: 0, value: 'Cancelada', description: 'Cancelada', style: 'danger' },
  { id: 1, value: 'Creada', description: 'Creada', style: 'warning' },
  { id: 3, value: 'Preparada', description: 'Preparada', style: 'primary' },
  { id: 4, value: 'Facturada', description: 'Facturada', style: 'success' },
  { id: 5, value: 'Anulada', description: 'Anulada', style: 'Light' },
  { id: 6, value: 'Entregada', description: 'Entregada', style: 'dark' }
];

const STATUS_DELIVERY = [
  { id: 3, value: 'Cancelada', description: 'Cancelada', style: 'danger' },
  { id: 1, value: 'Pendiente', description: 'Pendiente', style: 'warning' },
  { id: 4, value: 'En camino', description: 'En camino', style: 'primary' },
  { id: 5, value: 'Entregada', description: 'Entregada', style: 'success' },
  { id: 6, value: 'Entregada', description: 'Entregada', style: 'success' }
];


@Component({
  selector: 'app-list-order',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css'],
  preserveWhitespaces: true,
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class Order_ListComponent extends DatatableBase<OrderDto> implements OnInit {

  displayedColumns: string[] = ['extName','createUtcDate', 'totalAmount', 'customerName', 'customerEmail','keyBodega', 'status', 'opcion',];
  @ViewChild(MatSelect) CampanaSelect: MatSelect;

  states = STATUS_ORDER;
  delivery = STATUS_DELIVERY;
  data: OrderDto[];
  userInfo: IUserInfo;
  now: Date = new Date();
  startDate: Date = new Date(this.now.getFullYear(), this.now.getMonth(), this.now.getDate(), 0, 0, 0, 0);
  endDate: Date = new Date(this.now.getFullYear(), this.now.getMonth(), this.now.getDate(), 0, 0, 0, 0);
  pSearch: ListOrderParam = {
    criteria: '',
    extCode: [],
    extCodeInvoice: [],
    invoiceProvider: [],
    keyBodega: [],
    status: [],
    minTotalAmount: 0,
    maxTotalAmount: 1000000,
    initDate: '',
    endDate: ''
  }
  branchOffices: SucursalDto[] = [];
  branchOfficesData: Array<Select2OptionData>;
  branchOfficeSelected: string[] = [];
  branchOfficesConfig: Options = {
    multiple: true,
    tags: true,
    closeOnSelect: true,
    width: 250
  };

  statusData: Array<Select2OptionData> =
    [
      { id: '0', text: 'Cancelada' },
      { id: '1', text: 'Creada' },
      { id: '3', text: 'Preparada' },
      { id: '4', text: 'Facturada' },
      { id: '5', text: 'Anulada' },
      { id: '6', text: 'Entregada' }
    ];


  statusSelected: string[] = [];
  statusConfig: Options = {
    multiple: true,
    tags: true,
    closeOnSelect: true,
    width: 250
  };
  criteria: string = '';

  constructor(
    private _apiService: ApiOrderService,
    private _apiSucursalService: ApiSucursalService,
    public _modalService: NgbModal,
    private _toastr: ToastrService,
    public router: Router,
    private _sesionUser: SessionProvider) {

    super(_modalService);
  }

  public ngOnInit(): void {
    this.inicializador();

    this._sesionUser.getUserInfo().then((userInfo: IUserInfo) => {
      this.userInfo = userInfo;
      if (this.userInfo === undefined || this.userInfo === null) {
        this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
      }
    });
    this.listar();
    this.loadBranchOffices();
  }

  private convertStringArrayToNumberArray(strings: string[]): number[] {
    return strings.map(str => Number(str));
    // return strings.map(str => +str); // Alternativa usando el operador +
  }

  private listar(): void {
    this.pSearch.keyBodega = this.branchOfficeSelected;
    this.pSearch.status = this.convertStringArrayToNumberArray(this.statusSelected);
    this.pSearch.initDate = `${this.dateToString(this.startDate)}T00:00:00.000Z`;
    this.pSearch.endDate = `${this.dateToString(this.endDate)}T23:59:59.999Z`;
    //this.pSearch.initDate = `${this.dateToString(this.startDate)}`;
    //this.pSearch.endDate = `${this.dateToString(this.endDate)}`;
    this.pSearch.criteria = this.criteria;

    this._apiService.Listar(this.pSearch)
      .then(
        (result) => {
          this.data = result.data;

          this.dataSource = new MatTableDataSource<OrderDto>(this.data);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
         
        }
      );
  }

  private marcarEntregado(order: OrderDto): void {

    Utils.confirm(
      `¿Esta seguro que desea marcar como entregado?`,
      () => {

        if (order.status == 4) //Facturado
          this._apiService.MarcarEntregado(order.id)
            .then(
              (result) => {
                if (result) {
                  order.status = 6; //Entregada
                  this._toastr.success('Se marco como entregada.', 'Orden', { progressAnimation: 'decreasing', timeOut: 3000 });
                }
              }
            );
      });  
  }

  private  dameEstadoDelivery(): void {

    this.data.forEach((order, index) => {
      if (order.status == 4) //Facturado
      this._apiService.GetComplete(order.id)
        .then(
          (result) => {
            order = result;
          }
        );
    });
   
  }

  openOrderDetails(orderId: string): void {
    const urlTree = this.router.createUrlTree(['/orders_details', orderId]);
    const url = this.router.serializeUrl(urlTree);
    const fullUrl = `${window.location.origin}/#${url}`;
    window.open(fullUrl, '_blank');
  }

  public actualizarData(): void {
    this.listar();
  }

  public getState(item: OrderDto): any {
    var state = this.states.find(e => e.id === item.status);
    return state === undefined || state === null ? { description: 'undefined', style: 'warning' } : state;
  }

  public  getDelivery(item: OrderDto): any {
    if (item.saleOrderDelivery) {
      var state = this.delivery.find(e => e.id === item.saleOrderDelivery.status);
      return state === undefined || state === null ? { description: 'undefined', style: 'warning' } : state;
    } else {
      return { description: 'N/A', style: 'Dark' };
    }
  }


  public details(item: OrderDto): void {
    var newModal = this._modalService.open(OrderViewComponent, {
      windowClass: 'animated slideInUp',
      size: 'lg'
    });
    newModal.componentInstance.setData(item);
    newModal.result.then((result: SucursalDto) => {
      this.actualizarData();
    });
  }

  public dateToString(date: Date): string {
    if (!date) {
      return '';
    }
    return _moment(date).format('YYYY-MM-DD');
  }

  public loadBranchOffices() {
    this._apiSucursalService.Listar({ criteria: '', freeZone: [], status: [1] }).then((items: SucursalDto[]) => {
      this.branchOffices = items;
      this.branchOfficesData = [];
      for (let index = 0; index < this.branchOffices.length; index++) {
        const element = this.branchOffices[index];
        this.branchOfficesData.push({
          id: `${element.keyBodega}`,
          text: `${element.keyBodega} ${element.name}`
        });
      }
    });
  }
}
