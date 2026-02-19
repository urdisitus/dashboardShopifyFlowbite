import { BaseService, RequestOptions } from "./base.service";
import { SessionProvider } from "../providers/session/session.provider";
import { ExecutingService } from "./shared/executing.service";
import { HttpClient } from "@angular/common/http";
import { Utils } from "../providers/utils";
import swal from "sweetalert2";
import { Md5 } from 'ts-md5/dist/md5';
import { environment } from "src/environments/environment";
import { Injectable } from "@angular/core";

export class AuthBaseService extends BaseService {

    constructor(
        public http: HttpClient,
        public sessionProvider: SessionProvider,
        public executingService: ExecutingService
    ) {
        super(http, executingService);
    }

    protected getAsJsonAuth<T>(options: RequestOptions): Promise<T> {
        return new Promise((resolve, reject) => {
            this.sessionProvider.getUserInfo(options.preventLogin)
                .then((userInfo: IUserInfo) => {
                    let requestObj = {
                        headers: {
                            "UserAppAuth": window.btoa(`${userInfo ? userInfo.userId : 0}:${environment.configuration.applicationId}`)
                        }
                    };
                    Utils.clone(options, requestObj);
                    this.getAsJson<T>(options)
                        .then((response: T) => {
                            resolve(response);
                        })
                        .catch(error => {
                            reject(error);
                        });
                });
        });
    }

    protected deleteAsJson(options: RequestOptions): Promise<any> {
        return new Promise((resolve, reject) => {
            this.sessionProvider.getUserInfo(options.preventLogin)
                .then((userInfo: IUserInfo) => {
                    let requestObj = {
                        headers: {
                            "UserAppAuth": window.btoa(`${userInfo ? userInfo.userId : 0}:${environment.configuration.applicationId}`)
                        }
                    };
                    Utils.clone(options, requestObj);
                    super.deleteAsJson(options)
                        .then((response: any) => {
                            resolve(response);
                        })
                        .catch(error => {
                            reject(error);
                        });
                });
        });
  }

    protected postAsJsonAuthPopUp<T>(
        title: string,
        message: string,
        options: RequestOptions,
        preHtml: string = '',
        postHtml: string = '',
        preProcessHtml: (container: HTMLElement) => any = () => { }): Promise<T> {
        return new Promise((resolve, reject) => {
            swal({
                title: title,
                html: `
                <div id="swalConfirmationDiv">
                <div class="col-md-12">
                    <p>${message}</p>
                </div>
                ${preHtml}
                <div class="col-md-12" style="text-align: left">
                    <div class="form-group">
                        <span style="font-size: 14px">Usuario</span>
                        <input id="swal-user" class="form-control input-sm" placeholder="Ingresar Usuario" maxlength="30" autocomplete="nope" type="text">
                    </div>
                    <div class="form-group">
                        <span style="font-size: 14px">Contraseña</span>
                        <input id="swal-password" class="form-control input-sm" placeholder="Ingresar Contraseña" maxlength="30" autocomplete="nope"  type="password">
                    </div>
                </div>
                ${postHtml}
                <div>`,
                type: 'question',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Aceptar',
                cancelButtonText: 'Cancelar',
                reverseButtons: true,
                confirmButtonClass: 'btn btn-success btn-confirm-auth',
                cancelButtonClass: 'btn btn-danger mr-sm',
                preConfirm: () => {
                    return new Promise((resolve) => {
                        const res = {
                            AuthUser: document.getElementById('swal-user')['value'],
                            AuthPassword: document.getElementById('swal-password')['value']
                        };
                        const preProcessValue = preProcessHtml(document.getElementById('swalConfirmationDiv'));
                        resolve(Utils.clone(res, preProcessValue));
                    });
                }
            }).then((result) => {
                if (result.value) {
                    let auth = result.value;
                    this.sessionProvider.getUserInfo(options.preventLogin)
                        .then((userInfo: IUserInfo) => {
                            let md5 = new Md5();
                            let requestObj = {
                                headers: {
                                    "UserAppAuth": window.btoa(`${userInfo ? userInfo.userId : 0}:${environment.configuration.applicationId}`)
                                }
                            };
                            auth.AuthPassword = md5.appendStr(auth.AuthPassword).end();
                            Utils.clone(options.param, auth);
                            Utils.clone(options, requestObj);
                            this.postAsJson<T>(options)
                                .then((response: T) => {
                                    resolve(response);
                                })
                                .catch(error => {
                                    reject(error);
                                });
                        });
                }
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
            document.getElementById("swal-user").addEventListener("keyup", listener);
            document.getElementById("swal-password").addEventListener("keyup", listener);
        });
    }

    protected postAsJsonAuth<T>(options: RequestOptions): Promise<T> {
        return new Promise((resolve, reject) => {
            this.sessionProvider.getUserInfo(options.preventLogin)
                .then((userInfo: IUserInfo) => {
                    let requestObj = {
                        headers: {
                            "UserAppAuth": window.btoa(`${userInfo ? userInfo.userId : 0}:${environment.configuration.applicationId}`)
                        }
                    };
                    Utils.clone(options, requestObj);
                    this.postAsJson<T>(options)
                        .then((response: T) => {
                            resolve(response);
                        })
                        .catch(error => {
                            reject(error);
                        });
                });
        });
    }
}

export class FactucenAuthBaseService extends AuthBaseService {
    constructor(
        public http: HttpClient,
        public sessionProvider: SessionProvider,
        public executingService: ExecutingService
    ) {
        super(http, sessionProvider, executingService);
    }

    protected endPointConfig() {
        return environment.configuration.factucenEndPoint;
    }
}

export class JobAuthBaseService extends AuthBaseService {
  constructor(
    public http: HttpClient,
    public sessionProvider: SessionProvider,
    public executingService: ExecutingService
  ) {
    super(http, sessionProvider, executingService);
  }

  protected endPointConfig() {
    return environment.configuration.mainJobEndPoint;
  }
}

export class OrderManagmentAuthBaseService extends AuthBaseService {
  constructor(
    public http: HttpClient,
    public sessionProvider: SessionProvider,
    public executingService: ExecutingService
  ) {
    super(http, sessionProvider, executingService);
  }

  protected endPointConfig() {
    return environment.configuration.orderManagentEndPoint;
  }
}
