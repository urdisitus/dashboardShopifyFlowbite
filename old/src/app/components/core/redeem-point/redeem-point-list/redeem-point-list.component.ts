import { Component, OnInit, AfterViewInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatatableBase } from 'src/app/components/generic/component/datatable.base';
import { UsuarioListado } from 'src/app/models/security/administration/user/UsuarioListado';
import { merge } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Utils } from 'src/app/providers/utils';
import { FormControl, FormGroup } from '@angular/forms';

// Depending on whether rollup is used, moment needs to be imported differently.
// Since Moment.js doesn't have a default export, we normally need to import using the `* as`
// syntax. However, rollup creates a synthetic default module and we thus need to import it using
// the `default as` syntax.
import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import { defaultFormat as _rollupMoment } from 'moment';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatDialog } from '@angular/material';
import { RedeemPointDtoDataSource, RedeemPointService } from 'src/app/services/core/preapertura/redeem-point.service';
import { IRedeemPointDto } from 'src/app/models/external/redeem-point/redeem-point-dto';
import { RedeemPointFormComponent } from '../redeem-point-form/redeem-point-form.component';

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
  selector: 'app_redeem_point-list',
  templateUrl: './redeem-point-list.component.html',
  styleUrls: ['./redeem-point-list.component.css'],
  preserveWhitespaces: true,
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})

export class RedeemPointListComponent extends DatatableBase<UsuarioListado> implements OnInit, AfterViewInit {

  public _dataSource: RedeemPointDtoDataSource;

  public form = new FormGroup({
    criteria: new FormControl(null),
    endDate: new FormControl(null),
    startDate: new FormControl(null),
    status: new FormControl(null),
  });

  public displayedColumns: string[] = ['id', 'name', 'type', 'group', 'startDateD', 'endDateD', 'factor', 'value', 'minimalAmonunt', 'status', 'event'];
  public initialSize: number = 10;

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
    private _service: RedeemPointService,
    public dialog: MatDialog,
    public _modalService: NgbModal,
    public modal: NgbActiveModal) {
    super(_modalService);
    this._dataSource = new RedeemPointDtoDataSource(this._service);
  }

  ngOnInit(): void {
    this._dataSource.load({
    }, 0, this.initialSize);
  }

  ngAfterViewInit(): void {
    merge(this.paginator.page)
      .pipe(
        tap(() => this.loadPage())
      ).subscribe();
  }

  loadPage() {
    this._dataSource
      .load(
        {
          criteria: this.form.get('criteria').value,
          endDate: this.form.get('endDate').value ? this.dateToString(this.form.get('endDate').value) : null,
          startDate: this.form.get('startDate').value ? this.dateToString(this.form.get('startDate').value) : null,
          status: this.form.get('status').value,
        },
        this.paginator.pageIndex,
        this.paginator.pageSize);
  }

  showForm(item: IRedeemPointDto) {
    const dialogRef = this.dialog.open(RedeemPointFormComponent, {
      data: item,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadPage();
      }
    });
  }

  delete(element: IRedeemPointDto) {
    Utils.confirm(
      `¿Esta seguro que desea eliminar el elemento seleccionado?`,
      () => {
        this._service.detele(element.id).then((result: IRedeemPointDto) => {
          this.loadPage();
        });
      });
  }

  enable(element: IRedeemPointDto) {
    Utils.confirm(
      `¿Esta seguro que desea habilitar el elemento seleccionado?`,
      () => {
        this._service.enable(element.id).then((result: IRedeemPointDto) => {
          this.loadPage();
        });
      });
  }

  disable(element: IRedeemPointDto) {
    Utils.confirm(
      `¿Esta seguro que desea desabilitar el elemento seleccionado?`,
      () => {
        this._service.disable(element.id).then((result: IRedeemPointDto) => {
          this.loadPage();
        });
      });
  }

  dateToString(date: Date): string {
    if (!date) {
      return '';
    }
    return _moment(date).format('YYYY-MM-DD');
  }
}
