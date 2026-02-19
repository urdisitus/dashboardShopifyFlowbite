import { IRemoteStringDto, IRemoteStringParam } from './../../../dataTransferObjects/remote-string/remote-string-dto';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ExecutingService } from '../../shared/executing.service';
import { ApiResponse, BaseService } from '../../base.service';
import { IStoreAppRemoteStringDto } from 'src/app/dataTransferObjects/remote-string/store-app-remote-string-dto';

@Injectable()

export class RemoteStringService extends BaseService {

  constructor(
    public http: HttpClient,
    public executingService: ExecutingService
  ) {
    super(http, executingService);
  }

  stores(param: IStoreAppRemoteStringDto): Promise<IRemoteStringDto[]> {
    return new Promise((resolve) => {
      this.postAsJson<ApiResponse<IRemoteStringDto[]>>({
        method: '/api/v1.0/remotestring/app/stores',
        param: param,
        loadingMessage: 'Guardando recursos...'
      }).then((response: ApiResponse<IRemoteStringDto[]>) => {
        resolve(response.data);
      });
    });
  }

  list(param: IRemoteStringParam): Promise<IRemoteStringDto[]> {
    return new Promise((resolve) => {
      this.postAsJson<ApiResponse<IRemoteStringDto[]>>({
        method: '/api/v1.0/remotestring/list',
        param: param,
        loadingMessage: 'Obteniendo recursos...'
      }).then((response: ApiResponse<IRemoteStringDto[]>) => {
        resolve(response.data);
      });
    });
  }

  applist(): Promise<string[]> {
    return new Promise((resolve) => {
      this.getAsJson<ApiResponse<string[]>>({
        method: '/api/v1.0/remotestring/apps',
        loadingMessage: 'Obteniendo recursos...',
        noShowLoading: true
      }).then((response: ApiResponse<string[]>) => {
        resolve(response.data);
      });
    });
  }

  namespaceList(app: string = ''): Promise<string[]> {
    return new Promise((resolve) => {
      this.getAsJson<ApiResponse<string[]>>({
        method: '/api/v1.0/remotestring/namespaces'+ (app ? `?app=${app}` : ''),
        loadingMessage: 'Obteniendo recursos...',
        noShowLoading: true
      }).then((response: ApiResponse<string[]>) => {
        resolve(response.data);
      });
    });
  }
}
