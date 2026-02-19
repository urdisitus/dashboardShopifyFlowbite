import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ExecutingService } from "src/app/services/shared/executing.service";
import { ApiResponse, BaseService } from "src/app/services/base.service";
import { OrderTrackingDto } from "src/app/models/external/order/order-tracking-dto";

@Injectable()
export class ServiceShippingAddressOrder extends BaseService {

    apiMethod: string = '/api/v1.0/order/shipping/info/';

    constructor(
        public http: HttpClient,
        public executingService: ExecutingService
    ) {
        super(http, executingService);
    }

    get(orderId: number): Promise<ApiResponse<OrderTrackingDto>> {
        return new Promise((resolve) => {
            this.getAsJson<ApiResponse<OrderTrackingDto>>({
                method: this.apiMethod + orderId,
                noShowDialogError: true
            }).then((response: ApiResponse<OrderTrackingDto>) => {
                resolve(response);
            });
        });
    }
}