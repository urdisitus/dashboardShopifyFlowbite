import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { DatatableBase } from 'src/app/components/generic/component/datatable.base';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { merge } from 'rxjs';
import { TurnoDto } from 'src/app/models/external/arqueo/ArqueoRecuperarResult';
import { GetTurnosParam } from 'src/app/models/external/arqueo/GetTurnosParam';
import { TurnoDataSource } from 'src/app/services/external/arqueo/turno.datasource';
import { ServiceTurno } from 'src/app/services/external/arqueo/turno.service';
import { TurnoStateEnum } from 'src/app/models/external/arqueo/TurnoStateEnum';
import { tap } from 'rxjs/operators';
import { ArqueoRegenteComponent } from '../arqueo-regente/arqueo-regente.component';
import { Utils } from 'src/app/providers/utils';
import { ArqueoVoucherComponent } from '../arqueo-voucher/arqueo-voucher.component';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { Select2OptionData } from 'ng-select2';
import { Options } from 'select2';

// Depending on whether rollup is used, moment needs to be imported differently.
// Since Moment.js doesn't have a default export, we normally need to import using the `* as`
// syntax. However, rollup creates a synthetic default module and we thus need to import it using
// the `default as` syntax.
import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import { defaultFormat as _rollupMoment } from 'moment';
import { ShippingStatusEnum } from 'src/app/models/external/order/shipping-state-enum';
import { BranchOfficeDto } from 'src/app/models/external/location/BranchOfficeDto';
import { ServiceLocation } from 'src/app/services/external/location/location.service';
import { SessionProvider } from 'src/app/providers/session/session.provider';
import { ServiceArqueo } from 'src/app/services/external/arqueo/arqueo.service';

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
  selector: 'app-arqueo-list',
  templateUrl: './arqueo-list.component.html',
  styleUrls: ['./arqueo-list.component.css'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class ArqueoListComponent extends DatatableBase<TurnoDto> implements OnInit, AfterViewInit {

  public _dataSource: TurnoDataSource;
  param: GetTurnosParam = {
    branchOfficeIds: [],
    ids: [],
    pageIndex: 1,
    pageSize: 0,
    states: [
      TurnoStateEnum.Cerrardo
    ],
    tieneArqueo: null
  };
  criteria: string = '';
  now: Date = new Date();
  startDate: Date = new Date(this.now.getFullYear(), this.now.getMonth(), this.now.getDate(), 0, 0, 0, 0);
  endDate: Date = new Date(this.now.getFullYear(), this.now.getMonth(), this.now.getDate(), 0, 0, 0, 0);
  public displayedColumns: string[] = [
    'event',
    'codigoTurno',
    'codigoArqueo',
    'sucursal',
    'fecha',
    'usuario',
    'montoApertura',
    'fechaCierre',
    'totalmontosistema',
    'totalmontobs',
    'eventoIntegracionLastDate',
    'eventoIntegracionCount'
  ];
  branchOfficeSelected: string[] = [];
  disabledBranchOffice: boolean = true;
  branchOffices: BranchOfficeDto[] = [];
  branchOfficesData: Array<Select2OptionData>;
  branchOfficesConfig: Options = {
    multiple: true,
    tags: true,
    closeOnSelect: true,
    width: 250
  };
  public initialSize: number = 10;

  constructor(
    private service: ServiceTurno,
    private serviceArqueo: ServiceArqueo,
    public serviceLocation: ServiceLocation,
    public sessionProvider: SessionProvider,
    public modalService: NgbModal) {
    super(modalService);
    this._dataSource = new TurnoDataSource(this.service);
    sessionProvider.getUserInfo().then((response) => {
      if (response.keyBodega) {
        this.branchOfficeSelected.push(response.keyBodega + '_' + response.puntoVentaId);
      }
      this.disabledBranchOffice = response.roles.indexOf('1') === -1;
    });
    this.loadBranchOffices();
  }

  dateToString(date: Date): string {
    if (!date) {
      return '';
    }
    return _moment(date).format('YYYY-MM-DD');
  }

  ngOnInit() {
    this.search();
  }

  ngAfterViewInit(): void {
    merge(this.paginator.page)
      .pipe(
        tap(() => this.search())
      ).subscribe();
  }


  buildBrancOfficeId(noCia: string, keyBodega: string, puntoVentaId: number) {
    return `${keyBodega}_${puntoVentaId}`;
  }

  buildBrancOfficeName(keyBodega: string, puntoVentaId: number, nombre: string) {
    return `${keyBodega}/${puntoVentaId} ${nombre}`;
  }

  loadBranchOffices() {
    this.serviceLocation.get().then((items: BranchOfficeDto[]) => {
      this.branchOffices = items;
      this.branchOfficesData = [];
      for (let index = 0; index < this.branchOffices.length; index++) {
        const element = this.branchOffices[index];
        this.branchOfficesData.push({
          id: this.buildBrancOfficeId(element.noCia, element.keyBodega, element.puntoVentaId),
          text: this.buildBrancOfficeName(element.keyBodega, element.puntoVentaId, element.nombre)
        });
      }
    });
  }

  search() {
    this.param.branchOfficeIds = this.branchOfficeSelected;
    this.param.criteria = this.criteria;
    this.param.startDate = this.dateToString(this.startDate);
    this.param.endDate = this.dateToString(this.endDate);
    this.param.pageIndex = this.paginator.pageIndex;
    this.param.pageSize = this.paginator.pageSize;
    this._dataSource.search(this.param);
  }

  arqueoRegente(turno: TurnoDto) {
    var newModal = this._modalService.open(ArqueoRegenteComponent, {
      windowClass: 'animated slideInUp',
      size: 'lg'
    });
    newModal.componentInstance.setData(turno);
    newModal.result.then((result: TurnoDto) => {
      this._dataSource.search(this.param);
    });
    return newModal;
  }

  viewRegente(turno: TurnoDto) {
    var newModal = this._modalService.open(ArqueoVoucherComponent, {
      windowClass: 'animated slideInUp',
      size: 'lg'
    });
    newModal.componentInstance.setData(turno, false);
    newModal.result.then((result: TurnoDto) => {
      this._dataSource.search(this.param);
    });
    return newModal;
  }

  pase(turno: TurnoDto) {
    this.serviceArqueo.pase(turno.id);
  }
}
