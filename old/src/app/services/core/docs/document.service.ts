import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthBaseService } from '../../auth.base.service';
import { ExecutingService } from '../../shared/executing.service';
import { SessionProvider } from 'src/app/providers/session/session.provider';
import { ApiResponse } from '../../base.service';
import { IDocumentVersionDto } from 'src/app/dataTransferObjects/docs/documentdto';
import { environment } from 'src/environments/environment';

@Injectable()

export class DocumentService extends AuthBaseService {
  constructor(
    public http: HttpClient,
    public sessionProvider: SessionProvider,
    public executingService: ExecutingService
  ) {
    super(http, sessionProvider, executingService);
  }

  protected endPointConfig() {
    return environment.configuration.billingsqlEndPoint;
  }

  protected getUrlResource(): string {
    return environment.configuration.billingsqlEndPoint.urlBase;
  }

  protected getUserAuthResource(): string {
    return environment.configuration.billingsqlEndPoint.credentials.user;
  }

  protected getPasswordAuthResource(): string {
    return environment.configuration.billingsqlEndPoint.credentials.password;
  }

  store(param: FormData): Promise<IDocumentVersionDto> {
    return new Promise((resolve) => {
      this.post<ApiResponse<IDocumentVersionDto>>({
        method: '/api/v1.0/document',
        loadingMessage: 'Guardando Documento...',
        param: param
      }).then((response: ApiResponse<IDocumentVersionDto>) => {
        resolve(response.data);
      });
    });
  }

  getByExtCode(extCodes: string): Promise<IDocumentVersionDto[]> {
    return new Promise((resolve) => {
      this.getAsJson<ApiResponse<IDocumentVersionDto[]>>({
        method: `/api/v1.0/document/byextcode?noCia=${environment.configuration.noCia}&extCode=${extCodes}`,
        loadingMessage: 'Obteniendo Documento...',
      }).then((response: ApiResponse<IDocumentVersionDto[]>) => {
        resolve(response.data);
      });
    });
  }

  getByExtCodes(extCodes: string[]): Promise<IDocumentVersionDto[]> {
    return new Promise((resolve) => {
      this.postAsJson<ApiResponse<IDocumentVersionDto[]>>({
        method: '/api/v1.0/document/byextcodes',
        loadingMessage: 'Obteniendo Documentos...',
        param: {
          sNoCia: environment.configuration.noCia,
          ExtCodes: extCodes
        }
      }).then((response: ApiResponse<IDocumentVersionDto[]>) => {
        resolve(response.data);
      });
    });
  }
}
