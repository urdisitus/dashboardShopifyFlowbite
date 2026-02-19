import { Component, OnInit } from '@angular/core';
import { Select2OptionData } from 'ng-select2';
import { Options } from 'select2';
import { BranchOfficeDto, } from 'src/app/models/external/location/BranchOfficeDto';
import { SessionProvider } from 'src/app/providers/session/session.provider';
import { ServiceLocation } from 'src/app/services/external/location/location.service';
import { environment } from 'src/environments/environment';


// Depending on whether rollup is used, moment needs to be imported differently.
// Since Moment.js doesn't have a default export, we normally need to import using the `* as`
// syntax. However, rollup creates a synthetic default module and we thus need to import it using
// the `default as` syntax.
import * as _moment from 'moment';
import { List } from 'linqts';
import { AuthPermissionService } from 'src/app/services/security/session/Impl/auth.permission.service';
import { KeyValue } from '@angular/common';

export abstract class ReportBaseComponent implements OnInit {

  public onlyTheirSales = ['15', '3', '4', '6', '16'];
  public onlyBranchOfficeSales = ['2', '8', '11', '22'];
  public all = ['1'];
  public url: string;
  public now: Date = new Date();
  public startDate: Date = new Date(this.now.getFullYear(), this.now.getMonth(), 1, 0, 0, 0, 0);
  public endDate: Date = new Date(this.now.getFullYear(), this.now.getMonth(), this.now.getDate(), 0, 0, 0, 0);
  public userInfo: IUserInfo;
  public codCajero: string = '';
  public codVendedor: string = '';
  public codCaja: string = '';
  public generateDetail: boolean = false;
  public branchOfficeSelected: string[] = [];
  public disabledBranchOffice: boolean = true;
  public disabledCodCajero: boolean = true;
  public branchOffices: BranchOfficeDto[] = [];
  public branchOfficesData: Array<Select2OptionData>;
  public branchOfficesConfig: Options = {
    multiple: true,
    tags: true,
    closeOnSelect: true,
    width: 200
  };

  abstract reportTitle(): string;
  abstract reportSubtitle(): string;
  abstract reportType(): string;
  abstract buildParam(): any;
  abstract reportObjectAuthOperation(): KeyValue<string, string>

  constructor(
    public _authPermission: AuthPermissionService,
    public _serviceLocation: ServiceLocation,
    public _sessionProvider: SessionProvider
  ) {
    this._sessionProvider.getUserInfo().then((userInfo) => {
      this.userInfo = userInfo;
      this.onUserInfo(userInfo);
    });
  }

  onUserInfo(userInfo: IUserInfo) {

  }

  ngOnInit() {
    this._authPermission.verifyPermissionsById(this.reportObjectAuthOperation());
  }

  dateToString(date: Date): string {
    if (!date) {
      return '';
    }
    return _moment(date).format('YYYY-MM-DD');
  }

  clearBranchOffices() {
    this.branchOfficeSelected = [];
  }

  selectAllBranchOffices() {
    this.branchOfficeSelected = [];
    for (let index = 0; index < this.branchOffices.length; index++) {
      const element = this.branchOffices[index];
      this.branchOfficeSelected.push(this.buildBrancOfficeId(element.noCia, element.keyBodega, element.puntoVentaId));
    }
  }

  loadBranchOffices() {
    this._serviceLocation.get().then((items: BranchOfficeDto[]) => {
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

  buildBrancOfficeId(noCia: string, keyBodega: string, puntoVentaId: number) {
    return `${keyBodega}_${puntoVentaId}`;
  }

  buildBrancOfficeName(keyBodega: string, puntoVentaId: number, nombre: string) {
    return `${keyBodega}/${puntoVentaId} ${nombre}`;
  }

  onGenerateClick() {
    this.url = null;
    this._serviceLocation.executingService.show();
    this._authPermission.verifyPermissionsById(this.reportObjectAuthOperation()).then(result => {
      const url = this.generateUrlReport();
      this.url = url;
    });
  }

  onLoadComplete() {
    setTimeout(() => {
      this._serviceLocation.executingService.hide()
    }, 1000);
  }

  generateUrlReport(): string {
    let paramAny = this.buildParam();
    let paramArray: string[] = [];
    for (let key in paramAny) {
      paramArray.push(`${key}:${paramAny[key]}`);
    }
    return `${environment.configuration.mainEndPoint.urlBase}/report/${this.reportType()}?query=${btoa(paramArray.join('|'))}`;
  }

  anyRoles(array: string[]): boolean {
    const rolesList = new List<string>((this.userInfo
      && this.userInfo.roles) ? this.userInfo.roles : []);
    return new List<string>(array).Any(x => rolesList.Any(y => x === y));
  };

  codCajeroDisabled(): boolean {
    return !this.userInfo
      || (!this.anyRoles(this.all)
        && !this.anyRoles(this.onlyBranchOfficeSales)
        && this.anyRoles(this.onlyTheirSales));
  }

  codCajeroInit(): string {
    if (this.userInfo
      && this.userInfo.userId
      && this.codCajeroDisabled()) {
      return this.userInfo.userId.toString();
    }
    return '';
  }

  branchOfficeDisabled(): boolean {
    return !this.userInfo
      || (!this.anyRoles(this.all)
        && (this.anyRoles(this.onlyBranchOfficeSales)
          || this.anyRoles(this.onlyTheirSales)));
  }

  branchOfficeInit(): string[] {
    if (this.userInfo
      && this.userInfo.keyBodega) {
      return [this.userInfo.keyBodega + '_' + this.userInfo.puntoVentaId];
    }
    return [];
  }
}
