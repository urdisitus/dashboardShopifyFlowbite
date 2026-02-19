import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from "@angular/common/http";
import { ListarVentaSeguroParam, ListarVentaSeguroResult } from '../../../dataTransferObjects/seguro/seguro';
import { FactucenAuthBaseService } from '../../auth.base.service';
import { SessionProvider } from '../../../providers/session/session.provider';
import { ExecutingService } from '../../shared/executing.service';
import { ApiResponse } from '../../base.service';


const head = new HttpHeaders().set('Content-Type', 'application/json');

@Injectable()
export class ApiSeguroService extends FactucenAuthBaseService {

  constructor(
    public http: HttpClient,
    public sessionProvider: SessionProvider,
    public executingService: ExecutingService) {
    super(http, sessionProvider, executingService);
  }

  public ListarVentasSeguro(param: ListarVentaSeguroParam): Promise<Array<ListarVentaSeguroResult>> {
    var method: string = '/api/v1.0/seguros/sales/general';
    return new Promise((resolve) => {
      this.postAsJsonAuth<ApiResponse<Array<ListarVentaSeguroResult>>>({
        method: method,
        param: param
      }).then((response: ApiResponse<Array<ListarVentaSeguroResult>>) => {
        resolve(response.data);
      });
    });
  }
}
