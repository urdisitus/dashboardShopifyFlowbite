import { AuthBaseService } from "src/app/services/auth.base.service";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { SessionProvider } from "src/app/providers/session/session.provider";
import { ExecutingService } from "src/app/services/shared/executing.service";
import { ApiResponse } from "src/app/services/base.service";
import { OrderListItemDto } from "src/app/models/external/order/order-list-item-dto";
import { TipoDocumentoSFE } from "../../../models/external/order/tipo-documento-sfe";

@Injectable()
export class ServiceInoviceSFE extends AuthBaseService {

  apiMethod: string = '/api/v1.0/order/generate';
  apiInfo: string = '/api/v1.0/info/setting/general';
  apiReloadSetting: string = '/api/v1.0/setting/setup/reset';
  apiGetAllTipoDocumento: string = '/api/v1.0/sin/TipoDocumentoIdentidad/GetAll';

  constructor(
    public http: HttpClient,
    public sessionProvider: SessionProvider,
    public executingService: ExecutingService
  ) {
    super(http, sessionProvider, executingService);
  }

  generate(orderId: number): Promise<OrderListItemDto> {
    return new Promise((resolve) => {
      this.sessionProvider.getUserInfo().then((userInfo: IUserInfo) => {
        this.postAsJson<ApiResponse<OrderListItemDto>>({
          method: this.apiMethod,
          param: {
            NoCia: userInfo.noCia,
            IdOrden: orderId,
            Cachier: {
              CashierId: userInfo.userId,
              UserCashier: userInfo.userName
            }
          }
        }).then((response: ApiResponse<OrderListItemDto>) => {
          resolve(response.data);
        });
      });
    });
  }

  reloadInfo(): Promise<boolean> {
    return new Promise((resolve) => {
      this.postAsJson<ApiResponse<boolean>>({
        method: this.apiReloadSetting
      }).then((response: ApiResponse<boolean>) => {
        resolve(response.data);
      });
    });
  }

  getInfo(): Promise<any> {
    return new Promise((resolve) => {
      this.getAsJsonAuth<ApiResponse<any>>({
        method: this.apiInfo
      }).then((response: ApiResponse<any>) => {
        resolve(response.data);
      });
    });
  }

  getTipoDocumento(): Promise<TipoDocumentoSFE[]> {
    return new Promise((resolve) => {
      this.getAsJsonAuth<ApiResponse<TipoDocumentoSFE[]>>({
        method: this.apiGetAllTipoDocumento
      }).then((response: ApiResponse<any>) => {
        resolve(response.data);
      });
    });
  }



}
