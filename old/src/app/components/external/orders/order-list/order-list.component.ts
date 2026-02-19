import { CancelOrderService } from './../../../../services/external/order/cancel-order.service';
import { MarkAsDeliveredComponent } from './../mark-as-delivered/mark-as-delivered.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { ServiceOrderList } from 'src/app/services/external/order/order.list.service';
import { OrderListItemDto } from 'src/app/models/external/order/order-list-item-dto';
import { List } from 'linqts';
import { GetOrdersParam } from 'src/app/models/external/order/get-orders-param';
import { OrderListDataSource } from 'src/app/services/external/order/order.list..datasource';
import { ListResponseDto } from 'src/app/models/external/list-response-dto';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { UpdateNitNombreComponent } from '../update-nit-nombre/update-nit-nombre.component';
import { UpdateShippingAddressComponent } from '../update-shipping-address/update-shipping-address.component';
import { BuscarClientComponent } from '../../clients/buscar-client/buscar-client.component';
import { ClienteFarmacorpDto } from 'src/app/models/external/client/cliente-farmacorp-dto';
import { OrderInvoiceStateEnum } from 'src/app/models/external/order/order-invoice-state-enum';
import { ServiceInoviceOrder } from 'src/app/services/external/order/invoice.order.service';
import { ToastrService } from 'ngx-toastr';
import { Utils } from 'src/app/providers/utils';
import { MatPaginator } from '@angular/material';

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
import { ShippingStatusEnum } from 'src/app/models/external/order/shipping-state-enum';
import { IMotivoDto, IMotivoSFEDto, MotivoService } from 'src/app/services/core/preapertura/motivo.service';
import { VentaService } from 'src/app/services/external/order/venta.service';
import { IVentaDto } from 'src/app/models/external/order/venta-dto';
import { PostVoidInvoiceComponent } from '../post-void-invoice/post-void-invoice.component';
import { TipoDocumentoSFE } from '../../../../models/external/order/tipo-documento-sfe';
import { ServiceInoviceSFE } from '../../../../services/external/order/invoice.sfe.service';
import { environment } from '../../../../../environments/environment';

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
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class OrderListComponent implements OnInit {
  columns: ColumnDef[] = [
    {
      name: 'actions',
      title: 'Acciones',
      custom: true
    },
    {
      name: 'name',
      title: 'Orden',
      custom: true
    },
    {
      name: 'saleUser',
      title: 'Vendedor'
    },
    {
      name: 'processedAtStr',
      title: 'Fecha'
    },
    {
      name: 'localidad',
      title: 'Sucursal',
      custom: true
    },
    {
      name: 'customerCompleteName',
      title: 'Cliente'
    },
    {
      name: 'invoice',
      title: 'Datos Facturación',
      custom: true
    },
    {
      name: 'shippingAddress',
      custom: true
    },
    {
      name: 'totalPrice',
      title: 'Monto Total'
    },
    {
      name: 'financialStatus',
      title: 'Estado de Pago',
      custom: true
    },
    {
      name: 'fulfillmentStatus',
      title: 'Estado de Orden',
      custom: true
    },
    {
      name: 'invoiceStatus',
      title: 'Estado de Facturación',
      custom: true
    },
    {
      name: 'shippingStatus',
      title: 'Estado de Entrega',
      custom: true
    }
  ];

  statusArray: DataBag[] = [
    {
      id: 'open',
      name: 'Pendiente'
    },
    {
      id: 'closed',
      name: 'Finalizado'
    },
    {
      id: 'cancelled',
      name: 'Cancelado'
    },
    {
      id: 'any',
      name: 'Todos'
    }
  ];
  trackingUrl: string = null;
  fulfillmentStatusSelected: string[] = ["any"];

  fulfillmentStatusArray: DataBag[] = [
    {
      id: 'shipped',
      name: 'Enviado',
      class: 'primary'
    },
    {
      id: 'partial',
      name: 'Parcial',
      class: 'warning'
    },
    {
      id: 'unshipped',
      name: 'No Enviado',
      class: 'default'
    },
    {
      id: 'unfulfilled',
      name: 'No Preparado',
      class: 'warn'
    },
    {
      id: 'fulfilled',
      name: 'Preparado',
      class: 'primary',
    },
    {
      id: 'any',
      name: 'Todos'
    }
  ];

  financialstatusSelected: string[] = ["any"];

  financialstatusArray: DataBag[] = [
    {
      id: 'authorized',
      name: 'Autorizado',
      class: 'default'
    },
    {
      id: 'pending',
      name: 'Pendiente',
      class: 'default'
    },
    {
      id: 'paid',
      name: 'Pagado',
      class: 'primary'
    },
    {
      id: 'partially_paid',
      name: 'Parcialmente Pagado',
      class: 'warning'
    },
    {
      id: 'refunded',
      name: 'Reintegrado',
      class: 'warn'
    },
    {
      id: 'voided',
      name: 'Anulado',
      class: 'warn'
    },
    {
      id: 'partially_refunded',
      name: 'Partialmente Reintegrado',
      class: 'warn'
    },
    {
      id: 'unpaid',
      name: 'No Pagado',
      class: 'accent'
    },
    {
      id: 'any',
      name: 'Todos'
    }
  ];

  public tipoDocumentoList: TipoDocumentoSFE[];

  financialstatus(key: string): DataBag {
    return new List<DataBag>(this.financialstatusArray).FirstOrDefault(x => x.id === key);
  }

  fulfillmentStatus(key: string): DataBag {
    return new List<DataBag>(this.fulfillmentStatusArray).FirstOrDefault(x => x.id === key);
  }

  financialstatusClass(key: string): string {
    return new List<DataBag>(this.financialstatusArray).Where(x => x.id === key).Select(x => x.class).FirstOrDefault();
  }

  fulfillmentStatusClass(key: string): string {
    return new List<DataBag>(this.fulfillmentStatusArray).Where(x => x.id === key).Select(x => x.class).FirstOrDefault();
  }

  financialstatusDesc(key: string): string {
    return new List<DataBag>(this.financialstatusArray).Where(x => x.id === key).Select(x => x.name).FirstOrDefault();
  }

  fulfillmentStatusDesc(key: string): string {
    return new List<DataBag>(this.fulfillmentStatusArray).Where(x => x.id === key).Select(x => x.name).FirstOrDefault();
  }


  now: Date = new Date();
  startDate: Date = new Date(this.now.getFullYear(), this.now.getMonth(), this.now.getDate(), 0, 0, 0, 0);
  endDate: Date = new Date(this.now.getFullYear(), this.now.getMonth(), this.now.getDate(), 0, 0, 0, 0);
  listParam: GetOrdersParam = {
    limit: '100',
    name: '',
    financialStatus: 'any',
    fulfillmentStatus: 'any',
    processedAtMax: '',
    processedAtMin: '',
    status: 'any',
    loadMore: true
  };

  listResponseDto: ListResponseDto<OrderListItemDto> = {};

  dataSource: OrderListDataSource;

  displayedColumns: string[] = this.columnList().Select(x => x.name).ToArray();

  autoColumns: ColumnDef[] = this.columnList().Where(x => !x.custom).ToArray();

  columnList(): List<ColumnDef> {
    return new List<ColumnDef>(this.columns);
  }

  public tipoFacturacion: number;

  constructor(
    private _toastr: ToastrService,
    private serviceInvoice: ServiceInoviceOrder,
    private serviceOrderList: ServiceOrderList,
    private serviceCancelOrder: CancelOrderService,
    private ventaService: VentaService,
    private serviceMotive: MotivoService,
    private serviceSFE: ServiceInoviceSFE,
    private _modalService: NgbModal) {
  }

  ngOnInit() {

    this.serviceSFE.getInfo().then(res => { this.tipoFacturacion = res.tipoFacturacion; }, error => console.error(error));
    this.serviceSFE.getTipoDocumento().then(res => { this.tipoDocumentoList = res; }, error => console.error(error));

    this.dataSource = new OrderListDataSource(this.serviceOrderList);
    this.reload();

  }

  dataList(): List<OrderListItemDto> {
    return new List<OrderListItemDto>(this.dataSource.data);
  }

  loadMotivos(): Promise<IMotivoDto[]> {
    return new Promise((resolve) => {
      this.serviceMotive.getSFE().then(data => resolve(data.map(e => {

        return <IMotivoDto>
          {
            estado: e.status,
            MotivoTipoId: e.id,
            texto: e.descript,
            keyCodigo: e.id.toString(),
            id: e.id,

          };
      })));
    });
  }

  reload() {
    this.cleanData();
    this.fetchNext();
  }

  cleanData() {
    this.listParam.loadMore = true;
    this.dataSource.data = [];
    this.listResponseDto = {
      data: []
    };
  }

  fetchNext() {
    this.listParam.pageInfo = this.listResponseDto.nextPageInfo;
    if (this.listParam.name) {
      this.listParam.status = 'any';
      this.listParam.processedAtMin = '';
      this.listParam.processedAtMax = '';
      this.listParam.financialStatus = '';
      this.listParam.fulfillmentStatus = '';
      this.listParam.salesUser = '';
    } else {
      this.listParam.processedAtMin = this.dateToString(this.startDate);
      this.listParam.processedAtMax = this.dateToString(this.endDate);
      this.listParam.financialStatus = this.financialstatusSelected.join(',');
      this.listParam.fulfillmentStatus = this.fulfillmentStatusSelected.join(',');
    }
    this.dataSource.orders(this.listParam).then((response: ListResponseDto<OrderListItemDto>) => {
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

  public showUpdateNitNombre(order: OrderListItemDto): NgbModalRef {
    var newModal = this._modalService.open(UpdateNitNombreComponent, {
      windowClass: 'animated slideInUp',
      size: 'sm'
    });
    newModal.componentInstance.setOrder(order, this.tipoDocumentoList, this.tipoFacturacion);
    newModal.result.then((result: OrderListItemDto) => {
      this._toastr.success('Se han guardado los datos de facturación exitosamente.', 'Modificación de Order');
      this.updateOrder(result, order.id);
    });
    return newModal;
  }

  public cancelOrder(element: OrderListItemDto) {
    Utils.confirm(
      `¿Esta seguro que desea cancelar la orden "${element.name}"?`,
      () => {
        this.serviceCancelOrder.update(element.id).then((result: OrderListItemDto) => {
          this._toastr.success('Se ha canceló la orden exitosamente.', 'Cancelación de orden');
          this.updateOrder(result, element.id);
          Utils.showAlert(
            'Cancelación de orden',
            `Se ha cancelado la orden exitosamente.`,
            () => {

            }
          );
        });
      });
  }

  public showMarkAsDelivered(order: OrderListItemDto): NgbModalRef {
    var newModal = this._modalService.open(MarkAsDeliveredComponent, {
      windowClass: 'animated slideInUp',
      size: 'sm'
    });
    newModal.componentInstance.setOrder(order);
    newModal.result.then((result: OrderListItemDto) => {
      this._toastr.success('Se han marcado como orden entregada.', 'Modificación de Order');
      this.updateOrder(result, order.id);
    });
    return newModal;
  }

  public showUpdateShippingAddress(order: OrderListItemDto): NgbModalRef {
    var newModal = this._modalService.open(UpdateShippingAddressComponent, {
      windowClass: 'animated slideInUp',
      size: 'lg'
    });
    newModal.componentInstance.setOrder(order);
    newModal.result.then((result: OrderListItemDto) => {
      this._toastr.success('Se han guardado el lugar de entrega exitosamente.', 'Modificación de Order');
      this.updateOrder(result, order.id);
    });
    return newModal;
  }

  keyPress(event: KeyboardEvent) {
    const pattern = /[0-9]/;
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      // invalid character, prevent input
      event.preventDefault();
    }
  }

  updateOrder(result: OrderListItemDto, id: number) {
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

  getShippingStatusColor(element: OrderListItemDto) {
    if (element && element.ordenEntrega) {
      if (element.ordenEntrega.estado === ShippingStatusEnum.ACEPTADO) {
        return 'primary';
      } else if (element.ordenEntrega.estado === ShippingStatusEnum.ASIGNADO) {
        return 'primary';
      } else if (element.ordenEntrega.estado === ShippingStatusEnum.CANCELADO) {
        return 'accent';
      } else if (element.ordenEntrega.estado === ShippingStatusEnum.ELIMINADO) {
        return 'accent';
      } else if (element.ordenEntrega.estado === ShippingStatusEnum.ENCAMINO) {
        return 'primary';
      } else if (element.ordenEntrega.estado === ShippingStatusEnum.EXITOSO) {
        return 'primary';
      } else if (element.ordenEntrega.estado === ShippingStatusEnum.PENDIENTE) {
        return 'default';
      } else if (element.ordenEntrega.estado === ShippingStatusEnum.ERROR) {
        return 'accent';
      }
    }
    return 'default';
  }

  getStatusInvoiceColor(element: OrderListItemDto) {
    if (element && element.invoice) {
      if (element.invoice.estado === OrderInvoiceStateEnum.Pendiente) {
        return 'default';
      } else if (element.invoice.estado === OrderInvoiceStateEnum.Registrado) {
        return 'primary';
      } else if (element.invoice.estado === OrderInvoiceStateEnum.Anulado) {
        return 'accent';
      }
    }
    return 'default';
  }

  getShippingStatus(element: OrderListItemDto) {
    if (element && element.ordenEntrega) {
      if (element.ordenEntrega.estado === ShippingStatusEnum.ACEPTADO) {
        return 'Aceptado';
      } else if (element.ordenEntrega.estado === ShippingStatusEnum.ASIGNADO) {
        return 'Asignado';
      } else if (element.ordenEntrega.estado === ShippingStatusEnum.CANCELADO) {
        return 'Cancelado';
      } else if (element.ordenEntrega.estado === ShippingStatusEnum.ELIMINADO) {
        return 'Eliminado';
      } else if (element.ordenEntrega.estado === ShippingStatusEnum.ENCAMINO) {
        return 'En Camino';
      } else if (element.ordenEntrega.estado === ShippingStatusEnum.EXITOSO) {
        return 'Exitoso';
      } else if (element.ordenEntrega.estado === ShippingStatusEnum.PENDIENTE) {
        return 'En Espera';
      } else if (element.ordenEntrega.estado === ShippingStatusEnum.ERROR) {
        return 'Error';
      }
    }
    return null;
  }

  getStatusInvoice(element: OrderListItemDto) {
    if (element && element.invoice) {
      if (element.invoice.estado === OrderInvoiceStateEnum.Pendiente) {
        return 'Pendiente';
      } else if (element.invoice.estado === OrderInvoiceStateEnum.Registrado) {
        return 'Procesado';
      } else if (element.invoice.estado === OrderInvoiceStateEnum.Anulado) {
        return 'Anulado';
      }
    }
    return 'Pendiente';
  }

  getUrlInvoice(element: OrderListItemDto) {
    this.serviceInvoice.getOrderInfo(element.id).then((result: any) => {
      if (result && result.invoiceWebUrl) {
        window.open(result.invoiceWebUrl, "_blank");
      }
    });
  }

  canGetInvoice(element: OrderListItemDto) {
    if (element.invoice) {
      return element.invoice && element.invoice.generated && element.invoice.estado == OrderInvoiceStateEnum.Registrado;
    }
    return false;
  }

  shippingOrder(element: OrderListItemDto) {
    Utils.confirm(
      `¿Esta seguro que desea enviar la entrega de la orden "${element.name}"?`,
      () => {
        this.serviceInvoice.shippingOrder(element.id).then((result: OrderListItemDto) => {
          this._toastr.success('Se ha realizado el envío de entrega exitosamente.', 'Enviar Entrega');
          this.updateOrder(result, element.id);
          Utils.showAlert(
            'Enviar Entrega',
            `Se ha realizado el envío de entrega exitosamente.`,
            () => {

            }
          );
        });
      });
  }

  cancelShippingOrder(element: OrderListItemDto) {
    Utils.confirm(
      `¿Esta seguro que desea cancelar la entrega de la orden "${element.name}"?`,
      () => {
        this.serviceInvoice.cancelShippingOrder(element.id).then((result: OrderListItemDto) => {
          this._toastr.success('Se ha realizado la cancelación de entrega exitosamente.', 'Enviar Entrega');
          this.updateOrder(result, element.id);
          Utils.showAlert(
            'Cancelar Entrega',
            `Se ha realizado la cancelación de entrega exitosamente.`,
            () => {

            }
          );
        });
      });
  }

  canShippingOrder(element: OrderListItemDto) {
    if (element.invoice) {
      return element.invoice &&
        element.invoice.generated &&
        element.invoice.estado == OrderInvoiceStateEnum.Registrado &&
        !element.ordenEntrega;
    }
    return false;
  }

  canCancelShippingOrder(element: OrderListItemDto) {
    if (element.invoice) {
      return element.ordenEntrega &&
        element.ordenEntrega.estado != 'CANCELADO' &&
        element.ordenEntrega.estado != 'ELIMINADO' &&
        element.ordenEntrega.estado != 'EXITOSO' &&
        element.ordenEntrega.estado != 'ERROR';
    }
    return false;
  }

  canPostVoidInvoice(element: OrderListItemDto) {
    if (element.invoice) {
      return element.invoice && element.invoice.generated && element.invoice.estado == OrderInvoiceStateEnum.Registrado;
    }
    return false;
  }

  canTracking(element: OrderListItemDto) {
    if (element.ordenEntrega) {
      return element.ordenEntrega &&
        (element.ordenEntrega.estado === 'ACEPTADO' ||
          element.ordenEntrega.estado === 'ASIGNADO' ||
          element.ordenEntrega.estado === 'ENCAMINO') &&
        element.ordenEntrega.agenteEntregaId;
    }
    return false;
  }

  canPostVoidInfo(element: OrderListItemDto) {
    if (element.invoice) {
      return element.invoice && element.invoice.generated && element.invoice.estado == OrderInvoiceStateEnum.Anulado;
    }
    return false;
  }

  canGenerateInvoice(element: OrderListItemDto) {
    if (this.tipoFacturacion == environment.configuration.facturacionElectronica) {
      if (!element.invoice
        && element.invoiceName
        && element.invoiceTypeDoc
        && element.invoiceDocument
        && element.invoiceEmail) {
        return (!element.invoice || element.invoice.estado == OrderInvoiceStateEnum.Pendiente) && element.fulfillmentStatus == 'fulfilled' && element.financialStatus == 'paid';
      }
    } else {
      if (!element.invoice && element.invoiceName && element.invoiceNumber) {
        return (!element.invoice || element.invoice.estado == OrderInvoiceStateEnum.Pendiente) && element.fulfillmentStatus == 'fulfilled' && element.financialStatus == 'paid';
      }
    } return false;
  }

  canCancelOrder(element: OrderListItemDto) {
    return !element.invoice
    && (!element.ordenEntrega || element.ordenEntrega.estado !== 'EXITOSO')
    && !(element.financialStatus === 'refunded' || element.financialStatus === 'partially_refunded' || element.financialStatus == "voided");
  }

  canMarkAsDelivered(element: OrderListItemDto) {
    return (!element.ordenEntrega || element.ordenEntrega.estado !== 'EXITOSO')
    && !(element.financialStatus === 'refunded' || element.financialStatus === 'partially_refunded' || element.financialStatus === "voided");
  }

  canEditOrder(element: OrderListItemDto) {
    return !element.invoice;
  }

  openTracking(trackingModal, element: OrderListItemDto) {
    const url = location.origin + location.pathname + '#/order/tracking/' + element.id;
    //const url = element.ordenEntrega.trackingLink;
    this.trackingUrl = url;
    this._modalService.open(trackingModal, {
      windowClass: 'animated slideInUp modal-xl',
      size: 'lg'
    });
    const elements: HTMLCollectionOf<Element> = document.getElementsByClassName('modal-content');
    if (elements && elements.length > 0) {
      const elem: HTMLElement = elements.item(0) as HTMLElement;
      elem.style.height = '90VH';
    }
  }

  generateInvoice(element: OrderListItemDto) {
    Utils.confirm(
      `¿Esta seguro que desea generar la factura para la orden "${element.name}"?`,
      () => {
        this.serviceInvoice.generate(element.id, this.tipoFacturacion).then((result: OrderListItemDto) => {
          if (result.invoice && result.invoice.invoiceWebUrl) {
            window.open(result.invoice.invoiceWebUrl, "_blank");
          }
          this._toastr.success('Se ha generado la factura exitosamente.', 'Generar Factura');
          this.updateOrder(result, element.id);
          Utils.showAlert(
            'Generar Factura',
            `Se ha generado la factura exitosamente.`,
            () => {

            }
          );
        });
      });
  }

  postVoiceInfo(element: OrderListItemDto) {
    this.ventaService.get(element.invoice.ventaId).then((venta: IVentaDto) => {
      var newModal = this._modalService.open(PostVoidInvoiceComponent, {
        windowClass: 'animated slideInUp'
      });
      newModal.componentInstance.setData(element, venta);
      newModal.result.then((result: any) => {
      });
      return newModal;
    });
  }

  postVoidInvoice(element: OrderListItemDto) {
    this.loadMotivos().then((values: IMotivoDto[]) => {
      this.serviceInvoice.postVoid(element.id, values).then((result: OrderListItemDto) => {
        this._toastr.success('Se ha realizado la anulación exitosamente.', 'Anular Factura');
        this.updateOrder(result, element.id);
        Utils.showAlert(
          'Anular Factura',
          `${result.messages.length > 0 ? ' * ' : ''}${result.messages.join('.\n * ')}${result.messages.length > 0 ? '.' : ''}
          \nSe ha realizado la anulación exitosamente.`,
          () => {

          }
        );
      });
    });
  }
}
