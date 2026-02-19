import { OrderListItemDto } from './../../../models/external/order/order-list-item-dto';
import { AuthBaseService } from "src/app/services/auth.base.service";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { SessionProvider } from "src/app/providers/session/session.provider";
import { ExecutingService } from "src/app/services/shared/executing.service";
import { ApiResponse } from "src/app/services/base.service";

@Injectable()
export class CancelOrderService extends AuthBaseService {

    apiMethod: string = '/api/v1.0/order/cancel_order/';

    constructor(
        public http: HttpClient,
        public sessionProvider: SessionProvider,
        public executingService: ExecutingService
    ) {
        super(http, sessionProvider, executingService);
    }

    update(param: number): Promise<OrderListItemDto> {
        return new Promise((resolve) => {
            this.getAsJson<ApiResponse<OrderListItemDto>>({
                method: this.apiMethod  + param,
            }).then((response: ApiResponse<OrderListItemDto>) => {
                resolve(response.data);
            });
        });
    }
}
