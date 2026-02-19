import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { OrderManagmentAuthBaseService } from '../auth.base.service';
import { SessionProvider } from '../../providers/session/session.provider';
import { ExecutingService } from '../shared/executing.service';
import { IShopifyCollectionPageDto, IShopifyOrderSimpleDto, IShopifyShopDtp as IShopifyShopDto, ListOrderParam, OrderDto, ResponseFilterRoot } from '../../dataTransferObjects/order/order';

@Injectable()
export class ApiOrderService extends OrderManagmentAuthBaseService {

  constructor(
    public http: HttpClient,
    public sessionProvider: SessionProvider,
    public executingService: ExecutingService) {
    super(http, sessionProvider, executingService);
  }

  Listar(param: ListOrderParam): Promise<ResponseFilterRoot> {
    var method: string = '/api/core/sale_order/filter';
    var p2 = {
      "param": param,
      "length": 10000,
      "start": 0
    };
    return new Promise((resolve) => {
      this.postAsJsonAuth<ResponseFilterRoot>({
        method: method,
        param: p2
      }).then((response: ResponseFilterRoot) => {
        resolve(response);
      });
    });
  }  

  Sync(shopKey: string, ids: string[]): Promise<boolean> {
    var method: string = `/api/external/order_webhook/${shopKey}/sync`;
    return this.postAsJson<boolean>({
      method: method,
      param: ids
    });
  }
  
  GetShopifyOrders(shopKey: string, param: any): Promise<IShopifyCollectionPageDto<IShopifyOrderSimpleDto>> {
    var method: string = `/api/shopify/order/${shopKey}/page`;
    return this.postAsJson<IShopifyCollectionPageDto<IShopifyOrderSimpleDto>>({
      method: method,
      param: param
    });
  }

  GetShopifyShops(): Promise<IShopifyShopDto[]> {
    var method: string = `/api/external/shopify/shops`;
    return this.getAsJson<IShopifyShopDto[]>({
      method: method      
    });
  }

  GetComplete(id: number): Promise<OrderDto> {
    var method: string = `/api/core/sale_order/complete/${id}`;
    return new Promise((resolve) => {
      this.getAsJson<OrderDto>({
        method: method,
      }).then((response: OrderDto) => {
        resolve(response);
      });
    });
  }

  MarcarEntregado(id: number): Promise<boolean> {
    var method: string = `/api/core/sale_order/Mark/Delivered/${id}`;
    return new Promise((resolve) => {
      this.putAsJson<boolean>({
        method: method,
      }).then((response: boolean) => {
        resolve(response);
      });
    });
  }
}
