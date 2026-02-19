import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ApiArqueoService } from 'src/app/services/core/preapertura/arqueo.service';
import { ConteoParam, CampanaResult, PreaperturaResult, PreaperturaCartillaResult, Canje } from 'src/app/dataTransferObjects/preapertura/preapertura';
import { SessionProvider } from 'src/app/providers/session/session.provider';
import { Router } from '@angular/router';
// Depending on whether rollup is used, moment needs to be imported differently.
// Since Moment.js doesn't have a default export, we normally need to import using the `* as`
// syntax. However, rollup creates a synthetic default module and we thus need to import it using
// the `default as` syntax.
import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import { defaultFormat as _rollupMoment } from 'moment';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material';

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
  selector: 'ngbd-modal-confirm',
  template: `
  <div class="modal-header bg-warning">
    <h4 class="modal-title modal-header-text-warning">Arqueo de sticker</h4>
    <button type="button" class="close" aria-describedby="modal-title" (click)="modal.dismiss('Cross click')">
      <span aria-hidden="true">&times;</span>
    </button>
  </div>
  <div class="modal-body">
    <p><strong>¿Esta seguro de realizar el arqueo de "Stickers"?</strong></p>
    <p>Usted esta ingresando la cantidad de sticker sobrantes en su turno.</p>
    <p>Una vez completada esta operación no puede ser anulada.</p>    
  </div>
  <div class="modal-footer">
    <button type="button" class="btn btn-outline-secondary" (click)="modal.dismiss('cancel click')">Cancel</button>
    <button type="button" class="btn btn-warning" (click)="modal.close('Ok click')">Ok</button>
  </div>
  `
})

export class NgbdModalConfirm {
  constructor(public modal: NgbActiveModal) { }
}

@Component({
  selector: 'app-campana-arqueo',
  templateUrl: './campana-arqueo.component.html',
  styleUrls: ['./campana-arqueo.component.css'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class CampanaArqueoComponent implements OnInit {

  public idPreaperturaSelect: number = undefined;
  public userInfo: IUserInfo;
  public idCampana: number = undefined;
  public cantStickerDevueltos: number;
  public message: string = '';
  public typeAlert: string = 'danger';
  public fechaOperacional: Date;
  public campanias: CampanaResult[] = [];
  public canjeArqueo: PreaperturaCartillaResult[] = []

  constructor(
    private _modalService: NgbModal,
    private _toastr: ToastrService,
    private _apiArqueoService: ApiArqueoService,
    public router: Router,
    private _sesionUser: SessionProvider) { }

  public ngOnInit(): void {
    this._sesionUser.getUserInfo().then((userInfo: IUserInfo) => {
      this.userInfo = userInfo;
      if (this.userInfo === undefined || this.userInfo === null) {
        this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
      }
    });

    this.fechaOperacional = new Date();

    this.listarCampania(this.fechaOperacional);
  }

  dateToString(date: Date): string {
    if (!date) {
      return '';
    }
    return _moment(date).format('YYYY-MM-DD');
  }

  public onSubmit(f: NgForm): void {

    var modal = this._modalService.open(NgbdModalConfirm, { windowClass: 'animated slideInUp' });
    modal.result.then((result) => {
      if (result === 'Ok click') {
        this.conteo(
          {
            cantidad: this.cantStickerDevueltos,
            preaperturaId: this.idPreaperturaSelect,
            canjes: this.canjeArqueo.map(e => {
              var canje: Canje = { id: e.canjeModalidadId, cantidad: e.cantCartillasCierreCajero };
              return canje;
            })
          });
      }
    }, (reason) => {
      //this.typeAlert = 'danger';
      //this.message = "Ocurrio un error al realizar el arqueo";
      //this._toastr.error('Error, no se pudo realizar el arqueo.', 'Arqueo');
    });
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

  private obtenerModalidadCanje(fechaOp: Date, idCampana: number): void {

    if (idCampana === undefined) {
      return;
    }

    this._apiArqueoService.ObtenerModalidadCanje({
      fecha: this.dateToString(fechaOp),
      campanaId: idCampana
    })
      .then(
        (result) => {

          this.canjeArqueo = result.map(e => {
            var modalidad: PreaperturaCartillaResult = {
              id: 0,
              canjeModalidadId: e.id,
              descripcion: e.descripcion,
              cantCartillasCierreCajero: undefined,
              cantCartillasCierreRegente: undefined,
              cantCartillasSistema: undefined
            }
            return modalidad;
          });

          console.log(this.canjeArqueo);
        }
      );
  }

  private listarPreaperturas(fechaOp: Date, idCampana: number): void {

    this.message = '';

    if (idCampana === undefined) {
      return;
    }

    this._apiArqueoService.ListarPrepapertura({
      fecha: this.dateToString(fechaOp),
      campanaId: idCampana
    })
      .then(
        (result) => {
          var arq = result.filter(e => e.cajeroUsuario == this.userInfo.userId.toString() && e.estado == 1);//1 == activo
          if (arq.length > 0) {
            this.idPreaperturaSelect = arq[0].id;
            // this.canjeArqueo = arq[0].campanaArqueoStickerDetalle;
          } else {
            this.idPreaperturaSelect = undefined;
            this.typeAlert = 'info';
            this.message = "No tiene arqueos pendientes";
          }
        }
      );
  }

  public changeDate(param: any): void {
    this.listarCampania(this.fechaOperacional);
    this.idCampana = undefined;
  }

  public changeCampana(param: any): void {

    this.obtenerModalidadCanje(this.fechaOperacional, this.idCampana);
    this.listarPreaperturas(this.fechaOperacional, this.idCampana);
  }

  public conteo(item: ConteoParam): void {
    this._apiArqueoService.ConteoPreapertura(item)
      .then(
        (data) => {
          if (data.ok) {
            this.cantStickerDevueltos = 0;
            this.idPreaperturaSelect = undefined;
            this.typeAlert = 'info';
            this.message = "Arqueo de stickers realizado exitosamente.";
            this._toastr.success('Arqueo de stickers realizado exitosamente.', 'Arqueo');
          } else {
            this.typeAlert = 'danger';
            this.message = "Ocurrio un error al realizar el arqueo";
            this._toastr.error('Error, no se pudo realizar el arqueo.', 'Arqueo');
          }
        }
      );
  }

  public close(): void {
    this.message = '';
  }
}
