import { Component, ViewChild, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NewPreaperturaComponent } from './new/newpreapertura.component';
import { ToastrService } from 'ngx-toastr';
import { ApiArqueoService } from 'src/app/services/core/preapertura/arqueo.service';
import { PreaperturaResult, CampanaResult } from 'src/app/dataTransferObjects/preapertura/preapertura';
import { Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { DateAdapter, MatSelect, MAT_DATE_FORMATS, MAT_DATE_LOCALE, } from '@angular/material';
import { SessionProvider } from 'src/app/providers/session/session.provider';
import { MatTableDataSource } from '@angular/material/table';
import { DatatableBase } from '../../generic/component/datatable.base';
import { ReconteoComponent } from './reconteo/reconteo.component';
import { CampanaAsignacionComponent } from '../campanas/campana-asignacion/campana-asignacion.component';

// Depending on whether rollup is used, moment needs to be imported differently.
// Since Moment.js doesn't have a default export, we normally need to import using the `* as`
// syntax. However, rollup creates a synthetic default module and we thus need to import it using
// the `default as` syntax.
import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import { defaultFormat as _rollupMoment } from 'moment';
import { MomentDateAdapter } from '@angular/material-moment-adapter';

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

const STATUS_ARQUEO = [
  {
    id: 0, value: 'Disabled', description: 'CERRADO', style: 'danger'
  },
  {
    id: 1, value: 'Enabled', description: 'ABIERTO', style: 'success'
  },
  {
    id: 2, value: 'Deleted', description: 'ELIMINADO', style: 'danger'
  },
  {
    id: 4, value: 'Count', description: 'CONTEO', style: 'primary'
  },
  {
    id: 5, value: 'Recount', description: 'FINALIZADO', style: 'dark'
  }
];

@Component({
  selector: 'app-preaperturaarqueo',
  templateUrl: './preaperturaarqueo.component.html',
  styleUrls: ['./preaperturaarqueo.component.css'],
  preserveWhitespaces: true,
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class PreaperturaarqueoComponent extends DatatableBase<PreaperturaResult> implements OnInit {

  public displayedColumns: string[] = ['id', 'cajeroUsuario', 'estado', 'opcion', 'cantApertura', 'cantSistema', 'cantCierreCajero', 'cantCierreRegente', 'canjeModalidad'];
  @ViewChild(MatSelect) CampanaSelect: MatSelect;
  public idCampana: number = undefined;
  public fechaOperacional: Date;

  public states = STATUS_ARQUEO;
  public data: PreaperturaResult[];
  public userInfo: IUserInfo;
  public campanias: CampanaResult[] = [];

  constructor(
    private _apiArqueoService: ApiArqueoService,
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
    this.fechaOperacional = new Date();
    this.listarCampania(this.fechaOperacional);
  }

  private listarPreaperturas(fechaOp: Date, idCampana: number): void {
    if (idCampana === undefined) {
      return;
    }

    this._apiArqueoService.ListarPrepapertura({
      fecha: this.dateToString(fechaOp),
      campanaId: idCampana
    })
      .then(
        (result) => {
          this.data = result;
          this.dataSource = new MatTableDataSource<PreaperturaResult>(this.data);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
      );
  }

  public nuevo() {
    var newModal = this._modalService.open(NewPreaperturaComponent, { windowClass: 'animated slideInUp' });
    newModal.result.then((result) => {
      this.save(result)
    }, () => { });
  }

  public getState(item: PreaperturaResult): any {
    var state = this.states.find(e => e.id === item.estado);
    return state === undefined || state === null ? { description: 'undefined', style: 'warning' } : state;
  }

  public modify(item: PreaperturaResult): void {
    var newModal = this._modalService.open(CampanaAsignacionComponent, {
      windowClass: 'animated slideInUp',
      size: 'sm'
    });
    newModal.componentInstance.setData(item);
    newModal.result.then((result: PreaperturaResult) => {
      this.listarPreaperturas(this.fechaOperacional, this.idCampana);
    });
  }

  public delete(item: PreaperturaResult): void {
    this.showModal('Eliminar preapertura', '¿Esta seguro de eliminar la preapertura seleccionada?').result.then((result) => {
      if (result === 'Ok click') {
        this._apiArqueoService.EliminarPreapertura(item.id)
          .then(
            (data) => {
              this.listarPreaperturas(this.fechaOperacional, this.idCampana);
              this._toastr.success('Se eliminó el registro de manera exitosa.', 'Preapertura', { progressAnimation: 'decreasing', timeOut: 3000 });
            }
          );
      }
    }, (reason) => { });
  }

  public save(item: PreaperturaResult): void {
    item.regenteUsuario = this.userInfo.userId.toString();
    item.campanaId = this.idCampana;
    item.fecha = this.fechaOperacional;
    this._apiArqueoService.InsertarPreapertura({
      fecha: this.dateToString(this.fechaOperacional),
      cantApertura: item.cantApertura,
      cantAsingado: item.cantApertura,
      cajeroUsuario: item.cajeroUsuario,
      regenteUsuario: this.userInfo.userId.toString(),
      campanaId: this.idCampana,
    })
      .then(
        (data) => {
          this.listarPreaperturas(this.fechaOperacional, this.idCampana);
          this._toastr.success('Se realizó el registro de manera exitosa.', 'Preapertura', { progressAnimation: 'decreasing', timeOut: 3000 });
        }
      );
  }

  dateToString(date: Date): string {
    if (!date) {
      return '';
    }
    return _moment(date).format('YYYY-MM-DD');
  }

  private listarCampania(fechaOp: Date): void {

    this._apiArqueoService.ListarCampania({
      fecha: this.dateToString(fechaOp)
    })
      .then(
        (result) => {
          this.campanias = result;
        }
      );
  }

  public reconteo(item: PreaperturaResult): void {
    var newModal = this._modalService.open(ReconteoComponent, { windowClass: 'animated slideInUp' });
    newModal.result.then((cantidadCierre) => {
      this.showModal('Reconteo preapertura', '¿Esta seguro de realizar el reconteo de la preapertura?').result.then((result) => {
        if (result === 'Ok click') {
          console.log(item);
          this._apiArqueoService.ReconteoPreapertura({
            preaperturaId: item.id,
            cantidad: cantidadCierre,
            keyBodega: item.keyBodega ? item.keyBodega : '',
            keyPuntoVenta: item.keyPuntoVenta ? item.keyPuntoVenta : '0',
            canjes: item.campanaArqueoStickerDetalle.map(e => { return { id: e.canjeModalidadId, cantidad: e.cantCartillasCierreRegente } })
          })
            .then(
              (data) => {
                if (data.ok) {
                  this.listarPreaperturas(this.fechaOperacional, this.idCampana);
                  this._toastr.success('Se registro de manera exitosa.', 'Preapertura', { progressAnimation: 'decreasing', timeOut: 3000 });
                }
              }
            );
        }
      }, () => { });
    }, () => { item.campanaArqueoStickerDetalle.forEach(e => e.cantCartillasCierreRegente = undefined); });

    newModal.componentInstance.idPreapertura = item.id;
    item.campanaArqueoStickerDetalle.forEach(e => e.cantCartillasCierreRegente = undefined);
    newModal.componentInstance.cantCanje = item.campanaArqueoStickerDetalle;

  }

  public changeDate(param: any): void {
    this.listarCampania(this.fechaOperacional);
    this.data.length = 0;
    this.dataSource = new MatTableDataSource<PreaperturaResult>(this.data);
    this.idCampana = undefined;
  }

  public changeCampana(param: any): void {
    this.actualizarData();
  }

  public actualizarData(): void {
    this.listarPreaperturas(this.fechaOperacional, this.idCampana);
  }

}
