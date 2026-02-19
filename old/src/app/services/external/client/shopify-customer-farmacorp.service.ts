
import { AuthBaseService } from "src/app/services/auth.base.service";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { SessionProvider } from "src/app/providers/session/session.provider";
import { ExecutingService } from "src/app/services/shared/executing.service";
import { ApiResponse } from "src/app/services/base.service";
import { CustomerDto } from "src/app/models/external/client/customer-dto";
import { ListResponseDto } from "src/app/models/external/list-response-dto";
import { StoreCustomerAddressParam } from "src/app/models/external/client/store-customer-address-param";
import { SearchCustomerParam } from "src/app/models/external/client/search-customer-param";
import { CustomerAddressDto } from "src/app/models/external/client/customer-address-dto";

@Injectable()
export class ServiceShopifyCustomer extends AuthBaseService {

    apiMethodSearch: string = '/api/v1.0/customer/search';
    apiMethodAddressStore: string = '/api/v1.0/customer/address/store';
    apiMethod: string = '/api/v1.0/customer/';
    apiMethodAddressDelete: string = '/api/v1.0/customer/address/delete';
    apiMethodAddressMarkDefault: string = '/address/mark_as_default/';

    constructor(
        public http: HttpClient,
        public sessionProvider: SessionProvider,
        public executingService: ExecutingService
    ) {
        super(http, sessionProvider, executingService);
    }

    search(param: SearchCustomerParam): Promise<ListResponseDto<CustomerDto>> {
        return new Promise((resolve) => {
            this.postAsJson<ApiResponse<ListResponseDto<CustomerDto>>>({
                method: this.apiMethodSearch,
                param: param
            }).then((response: ApiResponse<ListResponseDto<CustomerDto>>) => {
                resolve(response.data);
            });
        });
    }

    store(param: StoreCustomerAddressParam): Promise<CustomerDto> {
        return new Promise((resolve) => {
            this.postAsJson<ApiResponse<CustomerDto>>({
                method: this.apiMethodAddressStore,
                param: param
            }).then((response: ApiResponse<CustomerDto>) => {
                resolve(response.data);
            });
        });
    }

    delete(param: CustomerAddressDto): Promise<CustomerDto> {
        return new Promise((resolve) => {
            this.postAsJson<ApiResponse<CustomerDto>>({
                method: this.apiMethodAddressDelete,
                param: {
                    Id: param.id,
                    CustomerId: param.customer_id,
                    Default: param.default
                }
            }).then((response: ApiResponse<CustomerDto>) => {
                resolve(response.data);
            });
        });
    }


    markAsDefault(id: number, customerId: number): Promise<CustomerDto> {
        return new Promise((resolve) => {
            this.putAsJson<ApiResponse<CustomerDto>>({
                method: this.apiMethod + customerId.toString() + this.apiMethodAddressMarkDefault + id.toString(),
            }).then((response: ApiResponse<CustomerDto>) => {
                resolve(response.data);
            });
        });
    }

    get(customerId: string): Promise<CustomerDto> {
        return new Promise((resolve) => {
            this.getAsJson<ApiResponse<CustomerDto>>({
                method: this.apiMethod + customerId,
            }).then((response: ApiResponse<CustomerDto>) => {
                resolve(response.data);
            });
        });
    }
}