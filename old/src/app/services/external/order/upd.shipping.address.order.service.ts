import { AuthBaseService } from "src/app/services/auth.base.service";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { SessionProvider } from "src/app/providers/session/session.provider";
import { ExecutingService } from "src/app/services/shared/executing.service";
import { ApiResponse } from "src/app/services/base.service";
import { OrderListItemDto } from "src/app/models/external/order/order-list-item-dto";
import { ShippingAddressOrderParam } from "src/app/models/external/order/shipping-address-order-param";

@Injectable()
export class ServiceUpdShippingAddressOrder extends AuthBaseService {

    apiMethod: string = '/api/v1.0/order/shipping_addres_order';

    constructor(
        public http: HttpClient,
        public sessionProvider: SessionProvider,
        public executingService: ExecutingService
    ) {
        super(http, sessionProvider, executingService);
    }

    update(param: ShippingAddressOrderParam): Promise<OrderListItemDto> {
        return new Promise((resolve) => {
            this.postAsJson<ApiResponse<OrderListItemDto>>({
                method: this.apiMethod,
                param: param
            }).then((response: ApiResponse<OrderListItemDto>) => {
                resolve(response.data);
            });
        });
    }
}