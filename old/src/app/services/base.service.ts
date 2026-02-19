import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Utils } from "../providers/utils";
import { environment } from "src/environments/environment";
import swal, { SweetAlertType } from 'sweetalert2';
import { ExecutingService } from './shared/executing.service';
import { ErrorResponse } from '../dataTransferObjects/Base.Response';
import { Injectable } from '@angular/core';

export class RequestOptions {
    method?: string;
    param?: any;
    noShowDialogError?: boolean = false;
    noShowDialogLogicError?: boolean = false;
    noShowLoading?: boolean = false;
    loadingMessage?: string = "Procesando solicitud...";
    headers?: any;
    json?: boolean;
    preventLogin?: boolean = false;
    logicErrorCallback?: (code: string, message: string, errors: ErrorResponse[]) => void;
}

export interface ApiParam<T> {
    data?: T;
}

export interface ErrorCode {
    code?: string;
    message?: string;
    moreInfo?: string;
}

export interface ApiResponse<T> {
    code?: number;
    data?: T;
    errors?: ErrorCode[];
    dateTime?: Date;
}

export class BaseService {

    /*========================================
      CRUD Methods for consuming RESTful API
    =========================================*/

    public appEnvironment: any;

    // Http Options
    protected httpOptions = {
        headers: new HttpHeaders()
    }

    constructor(
        public http: HttpClient,
        public _executingService: ExecutingService) {
        this.appEnvironment = this.endPointConfig();
    }

    protected endPointConfig() {
        return environment.configuration.mainEndPoint;
    }

    protected environmentConfig() {
        return environment.configuration;
    }

    protected buildHeaders(
        json: boolean,
        headerObj: any) {
        let headers = {};

        if (json) {
            headers['Content-Type'] = 'application/json';
        }
        headers['Authorization'] = `Basic ${window.btoa(`${this.appEnvironment.credentials.user}:${this.appEnvironment.credentials.password}`)}`;
        if (headerObj) {
            for (const key in headerObj) {
                if (headerObj.hasOwnProperty(key)) {
                    const element = headerObj[key];
                    headers[key] = element;
                }
            }
        }
        return headers;
    }

    protected getUrlResource(): string {
        return this.appEnvironment.urlBase;
    }

    protected getAsJson<T>(options: RequestOptions): Promise<T> {
        let requestObj = {
            json: true,
            noShowDialogError: false,
            noShowDialogLogicError: false,
            noShowLoading: false,
            loadingMessage: "Procesando solicitud..."
        };

        Utils.clone(options, requestObj);

        if (!options.headers) {
            options.headers = {};
        }

        if (options.noShowDialogError) {
            options.headers['noShowDialogError'] = "true";
        }

        if (!options.noShowLoading) {
            this._executingService.show();
        } else {
            options.headers['noShowLoading'] = "true";
        }
        this.httpOptions.headers = new HttpHeaders(this.buildHeaders(options.json, options.headers));
        return new Promise((resolve, error) => {
            this.http.get<T>(this.getUrlResource() + options.method, this.httpOptions)
                .toPromise()
                .then((response: T) => {
                    resolve(response);
                    if (!options.noShowLoading) {
                        this._executingService.hide()
                    }
                }).catch((reason) => {
                    //    errorMessage: errorMessage,
                    //    error: error.error,
                    //    modal: modal
                    if (reason && reason.modal) {
                        reason.modal.setLogicErrorCallback(options.logicErrorCallback);
                    }
                    error(reason);
                    if (!options.noShowLoading) {
                        this._executingService.hide()
                    }
                });
        });
    }

    protected deleteAsJson(options: RequestOptions): Promise<any> {
        let requestObj = {
            json: true,
            noShowDialogError: false,
            noShowDialogLogicError: false,
            noShowLoading: false,
            loadingMessage: "Procesando solicitud..."
        };
        Utils.clone(options, requestObj);
        if (!options.headers) {
            options.headers = {};
        }

        if (options.noShowDialogError) {
            options.headers['noShowDialogError'] = "true";
        }

        if (!options.noShowLoading) {
            this._executingService.show();
        } else {
            options.headers['noShowLoading'] = "true";
        }
        this.httpOptions.headers = new HttpHeaders(this.buildHeaders(options.json, options.headers));
        return new Promise((resolve, error) => {
            this.http.delete(this.getUrlResource() + options.method, this.httpOptions)
                .toPromise()
                .then((response: any) => {
                    resolve(response);
                    if (!options.noShowLoading) {
                        this._executingService.hide()
                    }
                }).catch((reason) => {
                    //    errorMessage: errorMessage,
                    //    error: error.error,
                    //    modal: modal
                    if (reason && reason.modal) {
                        reason.modal.setLogicErrorCallback(options.logicErrorCallback);
                    }
                    error(reason);
                    if (!options.noShowLoading) {
                        this._executingService.hide()
                    }
                });
        });
    }

    protected postAsJson<T>(options: RequestOptions): Promise<T> {
        let requestObj = {
            json: true,
            noShowDialogError: false,
            noShowDialogLogicError: false,
            noShowLoading: false,
            loadingMessage: "Procesando solicitud..."
        };

        Utils.clone(options, requestObj);

        if (!options.headers) {
            options.headers = {};
        }

        if (options.noShowDialogError) {
            options.headers['noShowDialogError'] = "true";
        }

        if (!options.noShowLoading) {
            this._executingService.show();
        } else {
            options.headers['noShowLoading'] = "true";
        }
        var headers = this.buildHeaders(options.json, options.headers);
        this.httpOptions.headers = new HttpHeaders(headers);
        return new Promise((resolve, error) => {
            this.http.post<T>(this.getUrlResource() + options.method, JSON.stringify(options.param), this.httpOptions)
                .toPromise()
                .then((response: T) => {
                    resolve(response);
                    if (!options.noShowLoading) {
                        this._executingService.hide()
                    }
                }).catch((reason) => {
                    //    errorMessage: errorMessage,
                    //    error: error.error,
                    //    modal: modal
                    if (reason && reason.modal) {
                        reason.modal.setLogicErrorCallback(options.logicErrorCallback);
                    }
                    error(reason);
                    if (!options.noShowLoading) {
                        this._executingService.hide()
                    }
                });
        });
    }

    protected putAsJson<T>(options: RequestOptions): Promise<T> {
        let requestObj = {
            json: true,
            noShowDialogError: false,
            noShowDialogLogicError: false,
            noShowLoading: false,
            loadingMessage: "Procesando solicitud..."
        };

        Utils.clone(options, requestObj);
        if (!options.headers) {
            options.headers = {};
        }

        if (options.noShowDialogError) {
            options.headers['noShowDialogError'] = "true";
        }

        if (!options.noShowLoading) {
            this._executingService.show();
        } else {
            options.headers['noShowLoading'] = "true";
        }
        this.httpOptions.headers = new HttpHeaders(this.buildHeaders(options.json, options.headers));
        return new Promise((resolve, error) => {
            this.http.put<T>(this.getUrlResource() + options.method, JSON.stringify(options.param), this.httpOptions)
                .toPromise()
                .then((response: T) => {
                    resolve(response);
                    if (!options.noShowLoading) {
                        this._executingService.hide()
                    }
                }).catch((reason) => {
                    //    errorMessage: errorMessage,
                    //    error: error.error,
                    //    modal: modal
                    if (reason && reason.modal) {
                        reason.modal.setLogicErrorCallback(options.logicErrorCallback);
                    }
                    error(reason);
                    if (!options.noShowLoading) {
                        this._executingService.hide()
                    }
                });
        });
    }

    protected post<T>(options: RequestOptions): Promise<T> {
        let requestObj = {
            json: false,
            noShowDialogError: false,
            noShowDialogLogicError: false,
            noShowLoading: false,
            loadingMessage: "Procesando solicitud..."
        };

        Utils.clone(options, requestObj);

        if (!options.noShowLoading) {
            this._executingService.show();
        }
        const headers = new HttpHeaders(this.buildHeaders(options.json, options.headers));
        return new Promise((resolve, error) => {
            this.http.post<T>(this.getUrlResource() + options.method, options.param, {
                headers: headers
            }).toPromise()
                .then((response: T) => {
                    resolve(response);
                    if (!options.noShowLoading) {
                        this._executingService.hide()
                    }
                }).catch((reason) => {
                    //    errorMessage: errorMessage,
                    //    error: error.error,
                    //    modal: modal
                    if (reason && reason.modal) {
                        reason.modal.setLogicErrorCallback(options.logicErrorCallback);
                    }
                    error(reason);
                    if (!options.noShowLoading) {
                        this._executingService.hide()
                    }
                });
        });
    }

    onFailure(error, noShowError: boolean) {
        if (error) {
            this.openSuccessCancelSwal(
                'Alerta',
                error,
                'warning',
                null,
                false);
        }
        if (!noShowError) {
            this.openSuccessCancelSwal(
                'Alerta',
                'Ha ocurrido un error de comunicación con el servicio, comuniquese con el administrador.',
                'warning',
                null,
                false);
        }
    }

    handleError(error) {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
            // Get client-side error
            errorMessage = error.error.message;
        } else {
            // Get server-side error
            errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        }
        //return throwError(errorMessage);
    }

    openSuccessCancelSwal(
        title: string,
        message: string,
        type: SweetAlertType,
        html: string = null,
        showCancelButton: boolean = false,
        confirmButtonText: string = 'Si',
        cancelButtonText: string = 'No',
        successCallback: () => void = null,
        cancelCallback: () => void = null) {
        swal({
            title: title,
            text: message,
            html: html,
            type: type,
            showCancelButton: showCancelButton,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: confirmButtonText,
            cancelButtonText: cancelButtonText,
            confirmButtonClass: 'btn btn-success',
            cancelButtonClass: 'btn btn-danger mr-sm'
        }).then((result) => {
            if (result.value) {
                if (successCallback) {
                    successCallback();
                }
            } else if (result.dismiss) {
                if (cancelCallback) {
                    cancelCallback();
                }
            }
        });
    }
}

export class FactucenBaseService extends BaseService {
    constructor(
        public http: HttpClient,
        public _executingService: ExecutingService) {
        super(http, _executingService);
    }

    protected endPointConfig() {
        return environment.configuration.factucenEndPoint;
    }
}

export class TookanApiBaseService extends BaseService {
    constructor(
        public http: HttpClient,
        public _executingService: ExecutingService) {
        super(http, _executingService);
    }

    protected endPointConfig() {
        return environment.configuration.tookanApiEndPoint;
    }
}
