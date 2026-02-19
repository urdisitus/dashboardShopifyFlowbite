import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SessionProvider } from '../../../providers/session/session.provider';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import { ApiResponse } from '../../base.service';
import { TurnoDto } from '../../../models/external/arqueo/ArqueoRecuperarResult';
import { AuthBaseService } from '../../auth.base.service';
import { IArqueoRegenteParam } from 'src/app/models/external/arqueo/ArqueoRegenteParam';
import { ExecutingService } from '../../shared/executing.service';

@Injectable()
export class ServiceArqueo extends AuthBaseService {

  apiMethodArqueoRegente: string = '/api/v1.0/arqueo/regente';
  apiMethodArqueoPase: string = '/api/v1.0/arqueo/pase/';

  constructor(
    public http: HttpClient,
    public sessionProvider: SessionProvider,
    public executingService: ExecutingService
  ) {
    super(http, sessionProvider, executingService);
  }

  regente(param: IArqueoRegenteParam): Promise<TurnoDto> {
    return new Promise((resolve) => {
      this.sessionProvider.getUserInfo().then((userInfo: IUserInfo) => {
        param.regente = userInfo.userName;
        param.regenteId = userInfo.userId;
        this.postAsJsonAuth<ApiResponse<TurnoDto>>({
          method: this.apiMethodArqueoRegente,
          param: param
        }).then((response: ApiResponse<TurnoDto>) => {
          resolve(response.data);
        });
      });
    });
  }

  pase(param: number): Promise<string> {
    return new Promise((resolve) => {
      this.getAsJsonAuth<ApiResponse<string>>({
        method: this.apiMethodArqueoPase + param
      }).then((response: ApiResponse<string>) => {
        resolve(response.data);
      });
    });
  }
}
