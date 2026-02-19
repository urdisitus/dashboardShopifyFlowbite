import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FactucenAuthBaseService } from '../../auth.base.service';
import { SessionProvider } from 'src/app/providers/session/session.provider';
import { ExecutingService } from '../../shared/executing.service';
import { ApiResponse } from '../../base.service';
import { IVentaDto } from 'src/app/models/external/order/venta-dto';

@Injectable()
export class VentaService extends FactucenAuthBaseService {

  constructor(
    public http: HttpClient,
    public sessionProvider: SessionProvider,
    public executingService: ExecutingService) {
    super(http, sessionProvider, executingService);
  }

  get(ventaId: number): Promise<IVentaDto> {
    var method: string = '/api/v1.0/billing/get/' + ventaId;
    return new Promise((resolve) => {
      this.getAsJsonAuth<ApiResponse<IVentaDto>>({
        method: method,
      }).then((response: ApiResponse<IVentaDto>) => {
        resolve(response.data);
      });
    });
  }
}
