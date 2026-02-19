import { AuthBaseService } from "src/app/services/auth.base.service";
import { Injectable } from "@angular/core";
import { ResultPage } from "src/app/models/generic/Impl/ResultPage";
import { HttpClient } from "@angular/common/http";
import { SessionProvider } from "src/app/providers/session/session.provider";
import { ExecutingService } from "src/app/services/shared/executing.service";
import { ApiResponse } from "src/app/services/base.service";
import { GetTurnosParam } from "src/app/models/external/arqueo/GetTurnosParam";
import { TurnoDto } from "src/app/models/external/arqueo/ArqueoRecuperarResult";
import { environment } from "src/environments/environment";
import { ArqueoCierreParam } from "src/app/models/external/arqueo/ArqueoCierrerParam";
import { PagoTipoItem } from "src/app/models/external/arqueo/PagoTipoResult";
import { IPagoTipoCerrarTurnoDto } from "src/app/models/external/arqueo/pago-tipo-cerrar-turno-dto";

@Injectable()
export class ServiceTurno extends AuthBaseService {

    apiMethod: string = '/api/v1.0/turno/get_turnos';
    apiMethodIniciar: string = '/api/v1.0/turno/iniciar';
    apiMethodDevolver: string = '/api/v1.0/turno/devolver';
    apiMethodCerrar: string = '/api/v1.0/turno/cerrar';
    apiMethodTipoPagoTurno: string = '/api/v1.0/turno/tipo_pago/';
    apiMethodTipoPago: string = '/api/v1.0/pagotipo';

    constructor(
        public http: HttpClient,
        public sessionProvider: SessionProvider,
        public executingService: ExecutingService
    ) {
        super(http, sessionProvider, executingService);
    }

    get(param: GetTurnosParam): Promise<ResultPage<TurnoDto>> {
        return new Promise((resolve) => {
            this.postAsJson<ApiResponse<ResultPage<TurnoDto>>>({
                method: this.apiMethod,
                param: param,
                noShowLoading: true
            }).then((response: ApiResponse<ResultPage<TurnoDto>>) => {
                resolve(response.data);
            });
        });
    }

    devolver(): Promise<TurnoDto> {
        return new Promise((resolve) => {
            this.sessionProvider.getUserInfo().then((userInfo: IUserInfo) => {
                this.postAsJson<ApiResponse<TurnoDto>>({
                    method: this.apiMethodDevolver,
                    param:
                    {
                        noCia: environment.configuration.noCia,
                        usuarioId: userInfo.userId
                    }
                }).then((response: ApiResponse<TurnoDto>) => {
                    resolve(response.data);
                });
            });
        });
    }

    iniciar(monto: number, comentario: string): Promise<TurnoDto> {
        return new Promise((resolve) => {
            this.sessionProvider.getUserInfo().then((userInfo: IUserInfo) => {
                this.postAsJson<ApiResponse<TurnoDto>>({
                    method: this.apiMethodIniciar,
                    param: {
                        noCia: environment.configuration.noCia,
                        usuarioId: userInfo.userId,
                        keyBodega: userInfo.keyBodega,
                        puntoVentaId: userInfo.puntoVentaId,
                        keyOrigen: environment.configuration.keySource,
                        montoApertura: monto,
                        observacionApertura: comentario,
                        cajaId: environment.configuration.cashboxId
                    }
                }).then((response: ApiResponse<TurnoDto>) => {
                    resolve(response.data);
                });
            });
        });
    }

    cerrar(param: ArqueoCierreParam): Promise<TurnoDto> {
        return new Promise((resolve) => {
            this.postAsJson<ApiResponse<TurnoDto>>({
                method: this.apiMethodCerrar,
                param: param
            }).then((response: ApiResponse<TurnoDto>) => {
                resolve(response.data);
            });
        });
    }

    tipoPago(): Promise<PagoTipoItem[]> {
        return new Promise((resolve) => {
            this.getAsJson<ApiResponse<PagoTipoItem[]>>({
                method: this.apiMethodTipoPago
            }).then((response: ApiResponse<PagoTipoItem[]>) => {
                resolve(response.data);
            });
        });
    }
    tipoPagoTurno(turnoId: number): Promise<IPagoTipoCerrarTurnoDto[]> {
        return new Promise((resolve) => {
            this.getAsJson<ApiResponse<IPagoTipoCerrarTurnoDto[]>>({
                method: this.apiMethodTipoPagoTurno+turnoId
            }).then((response: ApiResponse<IPagoTipoCerrarTurnoDto[]>) => {
                resolve(response.data);
            });
        });
    }
}
