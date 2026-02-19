import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { HttpHeaders } from "@angular/common/http";
import { environment } from 'src/environments/environment';
import { BaseResponse } from 'src/app/dataTransferObjects/Base.Response';
import { PreaperturaResult, ListarParam, NuevoParam, PreaperturaNuevaResult, ConteoParam, GetCampanaParam, CampanaResult, GetCampanaModalidadCanjeResult, GetCampanaModalidadCanjeParam } from 'src/app/dataTransferObjects/preapertura/preapertura';
import { retry, catchError } from 'rxjs/operators';
import { OperationInfo } from 'src/app/dataTransferObjects/OperationInfo';
import { FactucenAuthBaseService } from '../../auth.base.service';
import { SessionProvider } from 'src/app/providers/session/session.provider';
import { ExecutingService } from '../../shared/executing.service';
import { ApiResponse } from '../../base.service';
import { SaveCampanaAsignacionStickerView } from 'src/app/dataTransferObjects/preapertura/save-campana-asignacion-sticker';

export interface IMotivoDto {
  id?:number,
  keyCodigo ?: string;
  texto ?: string;
  MotivoTipoId ?: number;
  orden ?: number;
  estado ?: number;
}
export interface IMotivoSFEDto {
  id: number;
  hashData: string;
  descript: string;
  status: number;
  createDate: Date;
  createUserId: number;
  editUserId: number;
  editDate: Date;
  texto?: string;
  orden?: number;
}



@Injectable()
export class MotivoService extends FactucenAuthBaseService {

  constructor(
    public http: HttpClient,
    public sessionProvider: SessionProvider,
    public executingService: ExecutingService) {
    super(http, sessionProvider, executingService);
  }

  get(motivoTipoId: number): Promise<IMotivoDto[]> {
    var method: string = '/api/v1.0/motivo/'+motivoTipoId;
    return new Promise((resolve) => {
      this.getAsJson<ApiResponse<IMotivoDto[]>>({
        method: method,
      }).then((response: ApiResponse<IMotivoDto[]>) => {
        resolve(response.data);
      });
    });
  }

  getSFE(): Promise<IMotivoSFEDto[]> {
    var method: string = '/api/v1.0/sin/MotivoAnulacion/GetAll';
    return new Promise((resolve) => {
      this.getAsJson<ApiResponse<IMotivoSFEDto[]>>({
        method: method,
      }).then((response: ApiResponse<IMotivoSFEDto[]>) => {
        resolve(response.data);
      });
    });
  }
}
