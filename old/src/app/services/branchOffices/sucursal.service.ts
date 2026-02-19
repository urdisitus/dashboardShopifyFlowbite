import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { HttpHeaders } from "@angular/common/http";
import { environment } from 'src/environments/environment';
import { BaseResponse } from 'src/app/dataTransferObjects/Base.Response';
import { PreaperturaResult, ListarParam, NuevoParam, PreaperturaNuevaResult, ConteoParam, GetCampanaParam, CampanaResult, GetCampanaModalidadCanjeResult, GetCampanaModalidadCanjeParam } from 'src/app/dataTransferObjects/preapertura/preapertura';
import { retry, catchError } from 'rxjs/operators';
import { OperationInfo } from 'src/app/dataTransferObjects/OperationInfo';
import { SaveCampanaAsignacionStickerView } from 'src/app/dataTransferObjects/preapertura/save-campana-asignacion-sticker';
import { OrderManagmentAuthBaseService } from '../auth.base.service';
import { SessionProvider } from '../../providers/session/session.provider';
import { ExecutingService } from '../shared/executing.service';
import { ApiResponse } from '../base.service';
import { GetSucursalParam, SucursalDto, SucursalPolygonDto } from '../../dataTransferObjects/branchOffice/branchOffice';

@Injectable({
  providedIn: 'root',
})
export class ApiSucursalService extends OrderManagmentAuthBaseService {

  constructor(
    public http: HttpClient,
    public sessionProvider: SessionProvider,
    public executingService: ExecutingService) {
    super(http, sessionProvider, executingService);
  }

  Listar(param: GetSucursalParam): Promise<SucursalDto[]> {
    var method: string = '/api/core/branch_office/list';
    return new Promise((resolve) => {
      this.postAsJsonAuth<SucursalDto[]>({
        method: method,
        param: param
      }).then((response: SucursalDto[]) => {
        resolve(response);
      });
    });
  }

  Sync(): Promise<boolean> {
    var method: string = '/api/sync/sync_branch_office';
    return new Promise((resolve) => {
      this.postAsJsonAuth<boolean>({
        method: method,
      }).then((response: boolean) => {
        resolve(response);
      });
    });
  } 

  Enable(bodega: string): Promise<boolean> {
    var method: string = '/api/core/branch_office/enable';
    return new Promise((resolve) => {
      this.postAsJsonAuth<boolean>({
        method: method,
        param: { noCia: '01', keyBodega: bodega }
      }).then((response: boolean )   => {
        resolve(response);
      });
    });
  }

  Disable(bodega: string): Promise<boolean> {
    var method: string = '/api/core/branch_office/disable';
    return new Promise((resolve) => {
      this.postAsJsonAuth<boolean>({
        method: method,
        param: { noCia: '01', keyBodega: bodega }
      }).then((response: boolean) => {
        resolve(response);
      });
    });
  }

  Upsert(param: SucursalDto): Promise<SucursalDto> {
    var method: string = '/api/core/branch_office';
    return new Promise((resolve) => {
      this.postAsJsonAuth<SucursalDto>({
        method: method,
        param: param
      }).then((response: SucursalDto) => {
        resolve(response);
      });
    });
  }

  SetPolygon(param: SucursalPolygonDto): Promise<SucursalPolygonDto> {
    var method: string = '/api/core/branch_office';
    return new Promise((resolve) => {
      this.postAsJsonAuth<SucursalPolygonDto>({
        method: method,
        param: param
      }).then((response: SucursalPolygonDto) => {
        resolve(response);
      });
    });
  }

  GetPoligon(nroCia: string, keyBodega: string): Promise<SucursalPolygonDto> {
    var param = {
      noCia: nroCia,
      keyBodega: keyBodega
    }
    var method: string = '/api/core/branch_office/complete/byid';
    return new Promise((resolve) => {
      this.postAsJsonAuth<SucursalPolygonDto>({
        method: method,
        param: param
      }).then((response: SucursalPolygonDto) => {
        resolve(response);
      });
    });
  }
}
