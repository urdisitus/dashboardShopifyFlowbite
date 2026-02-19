import { KeyValue } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { SessionProvider } from 'src/app/providers/session/session.provider';
import { ServiceLocation } from 'src/app/services/external/location/location.service';
import { AuthPermissionService } from 'src/app/services/security/session/Impl/auth.permission.service';
import { environment } from 'src/environments/environment';
import { ReportBaseComponent } from '../generic/base-report.component';

@Component({
  selector: 'app-report-tiempos-entrega',
  templateUrl: './report-tiempos-entrega.component.html',
  styleUrls: ['./report-tiempos-entrega.component.css']
})
export class ReportTiemposEntregaComponent extends ReportBaseComponent implements OnInit {
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

  reportObjectAuthOperation(): KeyValue<string, string> {
    return {
      key: 'REP_DEL',
      value: null
    };
  }

  reportTitle(): string {
    return "Tiempos de Entrega";
  }

  reportSubtitle(): string {
    return "Reporte de Tiempos de Entrega de Ventas";
  }

  reportType(): string {
    return 'ventaentrega';
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
      Bodegas: this.branchOfficeSelected.join(',')
    };
  }

  ngOnInit() {
    super.ngOnInit();
  }
}

