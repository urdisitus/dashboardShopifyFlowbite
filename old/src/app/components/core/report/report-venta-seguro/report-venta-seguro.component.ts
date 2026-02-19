import { KeyValue } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { SessionProvider } from 'src/app/providers/session/session.provider';
import { ServiceLocation } from 'src/app/services/external/location/location.service';
import { AuthPermissionService } from 'src/app/services/security/session/Impl/auth.permission.service';
import { environment } from 'src/environments/environment';
import { ReportBaseComponent } from '../generic/base-report.component';

@Component({
  selector: 'app-report-venta-seguro',
  templateUrl: './report-venta-seguro.component.html',
  styleUrls: ['./report-venta-seguro.component.css']
})
export class ReportVentaSeguroComponent extends ReportBaseComponent implements OnInit {

  constructor(
    public _authPermission: AuthPermissionService,
    public _serviceLocation: ServiceLocation,
    public _sessionProvider: SessionProvider
  ) {
    super(_authPermission, _serviceLocation, _sessionProvider);
    this.loadBranchOffices();
  }

  onUserInfo(userInfo: IUserInfo) {
    this.branchOfficeSelected = this.branchOfficeInit();
    this.disabledBranchOffice = this.branchOfficeDisabled();
    this.codCajero = this.codCajeroInit();
    this.disabledCodCajero = this.codCajeroDisabled();
  }

  reportTitle(): string {
    return "Seguro";
  }

  reportSubtitle(): string {
    return "Reporte de Ventas con Seguro";
  }

  reportType(): string {
    return 'seguro';
  }

  buildParam() {
    return {
      NoCia : environment.configuration.keySource,
      ApplicationId: environment.configuration.applicationId,
      UserId: this.userInfo.userId,
      Usuario: this.userInfo.completeName,
      FechaInicio: this.dateToString(this.startDate),
      FechaFin: this.dateToString(this.endDate),
      VendedorCodigo: this.codVendedor,
      CajeroCodigo: this.codCajero,
      CajaCodigo: this.codCaja,
      Bodegas: this.branchOfficeSelected.join(','),
      GenerateDetail: this.generateDetail
    };
  }

  ngOnInit() {
    super.ngOnInit();
  }

  reportObjectAuthOperation(): KeyValue<string, string> {
    return {
      key: 'REP_SEG',
      value: null
    };
  }

}
