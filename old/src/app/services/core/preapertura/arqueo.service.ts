import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PreaperturaResult, ListarParam, NuevoParam, PreaperturaNuevaResult, ConteoParam, GetCampanaParam, CampanaResult, GetCampanaModalidadCanjeResult, GetCampanaModalidadCanjeParam } from 'src/app/dataTransferObjects/preapertura/preapertura';
import { OperationInfo } from 'src/app/dataTransferObjects/OperationInfo';
import { FactucenAuthBaseService } from '../../auth.base.service';
import { SessionProvider } from 'src/app/providers/session/session.provider';
import { ExecutingService } from '../../shared/executing.service';
import { ApiResponse } from '../../base.service';
import { SaveCampanaAsignacionStickerView } from 'src/app/dataTransferObjects/preapertura/save-campana-asignacion-sticker';

@Injectable()
export class ApiArqueoService extends FactucenAuthBaseService {

  constructor(
    public http: HttpClient,
    public sessionProvider: SessionProvider,
    public executingService: ExecutingService) {
    super(http, sessionProvider, executingService);
  }

  ObtenerModalidadCanje(param: GetCampanaModalidadCanjeParam): Promise<GetCampanaModalidadCanjeResult[]> {
    var method: string = '/api/v1.0/campana/modalidad/canje';
    return new Promise((resolve) => {
      this.postAsJsonAuth<ApiResponse<GetCampanaModalidadCanjeResult[]>>({
        method: method,
        param: param
      }).then((response: ApiResponse<GetCampanaModalidadCanjeResult[]>) => {
        resolve(response.data);
      });
    });
  }

  ListarCampania(param: GetCampanaParam): Promise<CampanaResult[]> {
    var method: string = '/api/v1.0/campana/listar/activa';
    return new Promise((resolve) => {
      this.postAsJsonAuth<ApiResponse<CampanaResult[]>>({
        method: method,
        param: param
      }).then((response: ApiResponse<CampanaResult[]>) => {
        resolve(response.data);
      });
    });
  }

  ListarPrepapertura(param: ListarParam): Promise<PreaperturaResult[]> {
    var method: string = '/api/v1.0/campana/arqueo/listar';
    return new Promise((resolve) => {
      this.postAsJsonAuth<ApiResponse<PreaperturaResult[]>>({
        method: method,
        param: param
      }).then((response: ApiResponse<PreaperturaResult[]>) => {
        resolve(response.data);
      });
    });
  }

  InsertarPreapertura(param: NuevoParam): Promise<PreaperturaNuevaResult> {
    var method: string = '/api/v1.0/campana/arqueo/nuevo';
    param.keySource = this.environmentConfig().keySource;
    return new Promise((resolve) => {
      this.postAsJsonAuth<ApiResponse<PreaperturaNuevaResult>>({
        method: method,
        param: param
      }).then((response: ApiResponse<PreaperturaNuevaResult>) => {
        resolve(response.data);
      });
    });
  }

  asignar(param: SaveCampanaAsignacionStickerView): Promise<PreaperturaResult> {
    var method: string = '/api/v1.0/campana/asignar';
    param.keySource = this.environmentConfig().keySource;
    return new Promise((resolve) => {
      this.postAsJsonAuth<ApiResponse<PreaperturaResult>>({
        method: method,
        param: param
      }).then((response: ApiResponse<PreaperturaResult>) => {
        resolve(response.data);
      });
    });
  }

  EliminarPreapertura(id: number): Promise<any> {
    var method: string = '/api/v1.0/campana/arqueo/eliminar/{id}';
    method = method.replace('{id}', id.toString());
    return new Promise((resolve) => {
      this.deleteAsJson({
        method: method
      }).then((response: ApiResponse<any>) => {
        resolve(response.data);
      });
    });
  }

  ConteoPreapertura(param: ConteoParam): Promise<OperationInfo> {
    var method: string = '/api/v1.0/campana/arqueo/conteo';
    param.keySource = this.environmentConfig().keySource;
    return new Promise((resolve) => {
      this.postAsJsonAuth<ApiResponse<OperationInfo>>({
        method: method,
        param: param
      }).then((response: ApiResponse<OperationInfo>) => {
        resolve(response.data);
      });
    });
  }

  ReconteoPreapertura(param: ConteoParam): Promise<OperationInfo> {
    var method: string = '/api/v1.0/campana/arqueo/reconteo';
    param.keySource = this.environmentConfig().keySource;
    return new Promise((resolve) => {
      this.postAsJsonAuth<ApiResponse<OperationInfo>>({
        method: method,
        param: param
      }).then((response: ApiResponse<OperationInfo>) => {
        resolve(response.data);
      });
    });
  }
}
