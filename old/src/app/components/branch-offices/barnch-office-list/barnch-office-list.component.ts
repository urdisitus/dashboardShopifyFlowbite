import { Component, ViewChild, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ApiSucursalService } from 'src/app/services/branchOffices/sucursal.service';
import { SucursalDto } from 'src/app/dataTransferObjects/branchOffice/branchOffice';
import { Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { DateAdapter, MatSelect, MAT_DATE_FORMATS, MAT_DATE_LOCALE, } from '@angular/material';
import { SessionProvider } from 'src/app/providers/session/session.provider';
import { MatTableDataSource } from '@angular/material/table';
import { DatatableBase } from '../../generic/component/datatable.base';
import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import { defaultFormat as _rollupMoment } from 'moment';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { BranchOfficesEditComponent } from '../branch-offices-edit/branch-offices-edit.component';
import { PoligonoComponent } from '../poligono/poligono.component';

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

const STATUS_BODEGA = [
  {
    id: 0, value: 'Disabled', description: 'Inactiva', style: 'danger'
  },
  {
    id: 1, value: 'Enabled', description: 'Activa', style: 'success'
  },
];

@Component({
  selector: 'app-barnch-office-list',
  templateUrl: './barnch-office-list.component.html',
  styleUrls: ['./barnch-office-list.component.css'],
  preserveWhitespaces: true,
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class BarnchOfficeListComponent extends DatatableBase<SucursalDto> implements OnInit {

  public displayedColumns: string[] = ['bodega', 'nombre', 'descripcion', 'ciudad', 'direccion', 'estado', 'opcion',];
  @ViewChild(MatSelect) CampanaSelect: MatSelect;

  public states = STATUS_BODEGA;
  public data: SucursalDto[];
  public userInfo: IUserInfo;
  constructor(
    private _apiService: ApiSucursalService,
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
    this.listarSucursales();
  }

  private listarSucursales(): void {

    this._apiService.Listar({ criteria: '', freeZone: [true, false], status : [0,1] })
      .then(
        (result) => {
          this.data = result;
          this.dataSource = new MatTableDataSource<SucursalDto>(this.data);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
      );
  }

  public actualizarData(): void {
    this.listarSucursales();
  }

  public syncData(): void {

    this._apiService.Sync()
      .then(
        (result) => {
          if (result) {
            this.actualizarData();
            this._toastr.success('Se sincronizaron las sucursales de manera exitosa.', 'Sucursales', { progressAnimation: 'decreasing', timeOut: 3000 });
          } else
          {
            this._toastr.error('Ocurrio un error al sincronizar sucursales.', 'Sucursales', { progressAnimation: 'decreasing', timeOut: 3000 });
          }
        }
      );
  }

  public enable(item: SucursalDto): void {

    this._apiService.Enable(item.keyBodega)
      .then(
        (result) => {
          if (result == true) {
            this.data.find(e => e.keyBodega == item.keyBodega).status = 1;
            this._toastr.success('Se habilito la sucursal de manera exitosa.', 'Sucursales', { progressAnimation: 'decreasing', timeOut: 3000 });
          } else {
            this._toastr.error('Ocurrio un error al habilitar la sucursal.', 'Sucursales', { progressAnimation: 'decreasing', timeOut: 3000 });
          }
        }
      );
  }

  public disable(item: SucursalDto): void {

    this._apiService.Disable(item.keyBodega)
      .then(
        (result) => {
          if (result == true) {
            this.data.find(e => e.keyBodega == item.keyBodega).status = 0;
            this._toastr.success('Se deshabilito la sucursal de manera exitosa.', 'Sucursales', { progressAnimation: 'decreasing', timeOut: 3000 });
          } else {
            this._toastr.error('Ocurrio un error al deshabilitar la sucursal.', 'Sucursales', { progressAnimation: 'decreasing', timeOut: 3000 });
          }
        }
      );
  }

  public getState(item: SucursalDto): any {
    var state = this.states.find(e => e.id === item.status);
    return state === undefined || state === null ? { description: 'undefined', style: 'warning' } : state;
  }

  public modify(item: SucursalDto): void {
    var newModal = this._modalService.open(BranchOfficesEditComponent, {
      windowClass: 'animated slideInUp',
      size: 'sm'
    });
    newModal.componentInstance.setData(item);
      newModal.result.then((result: SucursalDto) => {
        this.actualizarData();
    });
  }

  public poligono(item: SucursalDto): void {
    var newModal = this._modalService.open(PoligonoComponent, {
      windowClass: 'animated slideInUp',
      size: 'lg'
    });
    newModal.componentInstance.setData(item);
    newModal.result.then((result: SucursalDto) => {
      this.actualizarData();
    });
  }
}
