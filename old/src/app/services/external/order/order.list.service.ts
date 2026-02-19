import { AuthBaseService } from "src/app/services/auth.base.service";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { SessionProvider } from "src/app/providers/session/session.provider";
import { ExecutingService } from "src/app/services/shared/executing.service";
import { ApiResponse } from "src/app/services/base.service";
import { OrderListItemDto } from "src/app/models/external/order/order-list-item-dto";
import { GetOrdersParam } from "src/app/models/external/order/get-orders-param";
import { ListResponseDto } from "src/app/models/external/list-response-dto";
import { List } from "linqts";

@Injectable()
export class ServiceOrderList extends AuthBaseService {

    apiMethod: string = '/api/v1.0/order/orders';

    constructor(
        public http: HttpClient,
        public sessionProvider: SessionProvider,
        public executingService: ExecutingService
    ) {
        super(http, sessionProvider, executingService);
    }

    orders(param: GetOrdersParam): Promise<ListResponseDto<OrderListItemDto>> {
        return new Promise((resolve) => {
            this.sessionProvider.getUserInfo().then((userInfo : IUserInfo)=>{
                param.usuarioId = userInfo.userId;
                param.keyBodega = userInfo.keyBodega;
                param.isAdmin = new List<string>(userInfo.roles).Contains('1');
                this.postAsJson<ApiResponse<ListResponseDto<OrderListItemDto>>>({
                    method: this.apiMethod,
                    param: param
                }).then((response: ApiResponse<ListResponseDto<OrderListItemDto>>) => {
                    resolve(response.data);
                }); 
            });
        });
    }

    
}
