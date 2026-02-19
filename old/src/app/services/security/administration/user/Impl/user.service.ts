import { AuthBaseService } from "src/app/services/auth.base.service";
import { Injectable, NgZone } from "@angular/core";
import { FilterPageParam } from "src/app/models/generic/FilterPageParam";
import { UsuarioListado } from "src/app/models/security/administration/user/UsuarioListado";
import { ResultPage } from "src/app/models/generic/Impl/ResultPage";
import { HttpClient } from "@angular/common/http";
import { SessionProvider } from "src/app/providers/session/session.provider";
import { ExecutingService } from "src/app/services/shared/executing.service";
import { ApiResponse } from "src/app/services/base.service";
import { StoreUserParam } from "src/app/models/security/administration/params/store-user-param";
import { UsuarioDto } from "../../../session/Impl/session.service";
import { IRolDto } from "src/app/models/security/administration/user/Rol";

@Injectable()
export class ServiceUser extends AuthBaseService {

    apiMethod: string = '/api/v1.0/seguridad/filter';
    apiMethodStore: string = '/api/v1.0/seguridad/store';
    apiMethodRoles: string = '/api/v1.0/seguridad/roles';
    apiMethodDelete: string = '/api/v1.0/seguridad/delete/';

    constructor(
        public http: HttpClient,
        public sessionProvider: SessionProvider,
        public executingService: ExecutingService
    ) {
        super(http, sessionProvider, executingService);
    }

    filter(param: FilterPageParam<string>): Promise<ResultPage<UsuarioListado>> {
        return new Promise((resolve) => {
            this.postAsJsonAuth<ApiResponse<ResultPage<UsuarioListado>>>({
                method: this.apiMethod,
                param: param
            }).then((response: ApiResponse<ResultPage<UsuarioListado>>) => {
                resolve(response.data);
            });
        });
    }

    store(param: StoreUserParam): Promise<UsuarioDto> {
        return new Promise((resolve) => {
            this.sessionProvider.getUserInfo().then((user: IUserInfo)=>{
                param.usuarioEditor = user.userName;
                this.postAsJsonAuth<ApiResponse<UsuarioDto>>({
                    method: this.apiMethodStore,
                    param: param
                }).then((response: ApiResponse<UsuarioDto>) => {
                    if(response.data.id == user.userId){
                        user.keyBodega = response.data.keyBodega;
                        user.noCia = response.data.noCia;
                        user.puntoVentaId = response.data.puntoVentaId;
                        this.sessionProvider.setUserInfo(user);
                    }
                    resolve(response.data);
                });
            })
        });
    }

    deleteUser(param: number): Promise<any> {
        return new Promise((resolve) => {
            super.deleteAsJson({
                method: this.apiMethodDelete + param.toString(),
            }).then((response: any) => {
                resolve(response.data);
            });
        });
    }

    roles(): Promise<IRolDto[]> {
        return new Promise((resolve) => {
            this.getAsJsonAuth<ApiResponse<IRolDto[]>>({
                method: this.apiMethodRoles,
            }).then((response: ApiResponse<IRolDto[]>) => {
                resolve(response.data);
            });
        });
    }
}