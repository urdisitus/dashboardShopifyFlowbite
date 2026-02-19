import { AuthBaseService } from "src/app/services/auth.base.service";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { SessionProvider } from "src/app/providers/session/session.provider";
import { ExecutingService } from "src/app/services/shared/executing.service";
import { ApiResponse } from "src/app/services/base.service";
import { OrderListItemDto } from "src/app/models/external/order/order-list-item-dto";
import { environment } from "src/environments/environment";
import { IMotivoDto } from "../../core/preapertura/motivo.service";
import { List } from "linqts";

@Injectable()
export class ServiceInoviceOrder extends AuthBaseService {

    apiMethod: string = '/api/v1.0/order/generate';
    apiPostVoidMethod: string = '/api/v1.0/order/postvoid';
    apiGetOrderInfoMethod: string = '/api/v1.0/order/orderInfo';
    apiShippingOrder: string = '/api/v1.0/order/send_shipping';
    apiCancelShippingOrder: string = '/api/v1.0/order/cancel_shipping';

    constructor(
        public http: HttpClient,
        public sessionProvider: SessionProvider,
        public executingService: ExecutingService
    ) {
        super(http, sessionProvider, executingService);
    }

    generate(orderId: number, tipoFacturacion : number): Promise<OrderListItemDto> {
        return new Promise((resolve) => {
            this.sessionProvider.getUserInfo().then((userInfo: IUserInfo) => {
                this.postAsJson<ApiResponse<OrderListItemDto>>({
                    method: this.apiMethod,
                    param: {
                      NoCia: userInfo.noCia,
                      tipoFacturacion: tipoFacturacion,
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

    getOrderInfo(orderId: number): Promise<any> {
        return new Promise((resolve) => {
            this.postAsJsonAuthPopUp<ApiResponse<any>>(
                'Autorización',
                'Para ver la factura debe ingresar sus credenciales un usuario autorizado',
                {
                    method: this.apiGetOrderInfoMethod,
                    param: {
                        OrderId: orderId,
                        AplicacionId: environment.configuration.applicationId
                    }
                }).then((response: ApiResponse<any>) => {
                    resolve(response.data);
                });
        });
    }

    shippingOrder(orderId: number): Promise<any> {
        return new Promise((resolve) => {
            this.sessionProvider.getUserInfo().then((userInfo: IUserInfo) => {
                this.postAsJsonAuth<ApiResponse<any>>(
                    {
                        method: this.apiShippingOrder,
                        param: {
                            NoCia: userInfo.noCia,
                            IdOrden: orderId,
                            Provider: environment.configuration.deliveryKey,
                            Cachier: {
                                CashierId: userInfo.userId,
                                UserCashier: userInfo.userName
                            }
                        }
                    }).then((response: ApiResponse<any>) => {
                        resolve(response.data);
                    });
            });
        });
    }

    cancelShippingOrder(orderId: number): Promise<any> {
        return new Promise((resolve) => {
            this.sessionProvider.getUserInfo().then((userInfo: IUserInfo) => {
                this.postAsJsonAuth<ApiResponse<any>>(
                    {
                        method: this.apiCancelShippingOrder,
                        param: {
                            NoCia: userInfo.noCia,
                            IdOrden: orderId,
                            Provider: 'Tookan',
                            Cachier: {
                                CashierId: userInfo.userId,
                                UserCashier: userInfo.userName
                            }
                        }
                    }).then((response: ApiResponse<any>) => {
                        resolve(response.data);
                    });
            });
        });
    }

    //motivoId: number, otroMotivo: string
    postVoid(orderId: number, motivos: IMotivoDto[]): Promise<any> {
        const motiveList = new List<IMotivoDto>(motivos);
        return new Promise((resolve) => {
            this.sessionProvider.getUserInfo().then((userInfo: IUserInfo) => {
                this.postAsJsonAuthPopUp<ApiResponse<any>>(
                    'Autorización',
                    'Para proceder con la anulación debe ingresar sus credenciales un usuario autorizado',
                    {
                        method: this.apiPostVoidMethod,
                        param: {
                            NoCia: userInfo.noCia,
                            IdOrden: orderId,
                            CashierId: userInfo.userId,
                            Cashier: userInfo.userName,
                            AplicacionId: environment.configuration.applicationId
                        }
                    },
                    '',
                    `<div class="col-md-12" style="text-align: left">
                        <div class="form-group">
                            <span style="font-size: 14px">Motivo de Anulación</span>
                            <select class="form-control input-sm postVoid-motive">
                                ${motiveList.Select(x=> `<option value="${x.id}">${x.texto}</option>`).ToArray().join("")}
                            </select>
                        </div>
                        <div class="form-group">
                            <span style="font-size: 14px">Descripción de Anulación</span>
                            <input id="swal-other_motive" class="form-control input-sm postVoid-OtherMotive" placeholder="Ingresar una descripción extra" maxlength="255" type="text">
                        </div>
                    </div>`,
                    (container: HTMLElement) => {
                        let elementMotive: any =container.getElementsByClassName('postVoid-motive').item(0);
                        let elementOtherMotive: any =container.getElementsByClassName('postVoid-OtherMotive').item(0);
                        return {
                            MotivoId: elementMotive.value,
                            OtroMotivo: elementOtherMotive.value
                        };
                    }).then((response: ApiResponse<any>) => {
                        resolve(response.data);
                    });
                    const listener = function (event) {
                        // Number 13 is the "Enter" key on the keyboard
                        if (event.keyCode === 13) {
                            // Cancel the default action, if needed
                            event.preventDefault();
                            // Trigger the button element with a click
                            var buttonElement: any = document.getElementsByClassName("btn-confirm-auth").item(0);
                            buttonElement.click();
                        }
                    };
                    document.getElementById("swal-other_motive").addEventListener("keyup", listener);
            });
        });
    }
}
