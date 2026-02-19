import { Injectable, NgZone } from '@angular/core';
import { List } from 'linqts';
import { SessionProvider } from 'src/app/providers/session/session.provider';
import { ApiResponse } from 'src/app/services/base.service';
import { HttpClient } from '@angular/common/http';
import { ExecutingService } from 'src/app/services/shared/executing.service';
import { Md5 } from 'ts-md5/dist/md5';
import { AuthBaseService } from 'src/app/services/auth.base.service';

export class UsuarioDto {
    id?: number;
    nombres?: string;
    apellidos?: string;
    nombreCompleto?: string;
    email?: string;
    username?: string;
    telefono?: string;
    celular?: string;
    primerInicio?: boolean;
    tipoDocumentoIdentidadId?: number;
    documentoIdentidad?: string;
    estado?: number;
    noCia?: string;
    keyBodega?: string;
    puntoVentaId?: number;
    roles?: string[];
    privilegios?: UsuarioPrivilegioDto[];
    modulos?: UsuarioModuloDto[];
}

export class UsuarioPrivilegioDto {
    id?: number;
    rolId?: number;
    aplicacionId?: number;
    objetoAuthId?: string;
    objetoAuthPadreId?: string;
    operacionId?: string;
}

export class UsuarioModuloDto {
    id?: string;
    moduloPadreId?: string;
    objetoAuthPadreId?: string;
    aplicacionId?: number;
    titulo?: string;
    orden?: number;
    urlIcono?: string;
    ruta?: string;
    hijos?: UsuarioModuloDto[];
}

@Injectable()
export class SessionService extends AuthBaseService implements ISession {

    private ipRegex = new RegExp(/([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/);

    constructor(
        public http: HttpClient,
        public sessionProvider: SessionProvider,
        public executingService: ExecutingService,
        private zone: NgZone
    ) {
        super(http, sessionProvider, executingService);
    }

    private moduleParseRec(modules: UsuarioModuloDto[]): IDashboardMenu[] {
        return modules ? new List<UsuarioModuloDto>(modules)
            .Select<IDashboardMenu>(x => {
                x.hijos = x.hijos ? x.hijos : [];
                return {
                    id: x.id,
                    code: x.id,
                    name: x.titulo,
                    icon: x.urlIcono,
                    idParent: x.moduloPadreId,
                    route: x.ruta,
                    childrens: this.moduleParseRec(x.hijos),
                    aClass: null,
                    liClass: null,
                    active: false,
                    dropdown: false
                };
            }).ToArray() : [];
    }

    change_password(
        password: string,
        new_password: string): Promise<IUserInfo> {
        return new Promise((resolve) => {
            this.sessionProvider.getUserInfo().then((userSaved: IUserInfo) => {
                let md5Pasword = new Md5();
                let md5NewPasword = new Md5();
                this.postAsJsonAuth<ApiResponse<boolean>>({
                    method: "/api/v1.0/seguridad/change_password",
                    param: {
                        usuarioId: userSaved.userId,
                        password: md5Pasword.appendStr(password).end(),
                        newPassword: md5NewPasword.appendStr(new_password).end(),
                        ip: '127.0.0.1',
                        usuarioLogueado: userSaved.userName
                    }
                }).then((response: ApiResponse<boolean>) => {
                    resolve(userSaved);
                });
            });
        });
    }

    reset_password(
        user_id: number,
        new_password: string,
        resetPasswordRequest: number = null): Promise<boolean> {
        return new Promise((resolve) => {
            this.sessionProvider.getUserInfo(true).then((userSaved: IUserInfo) => {
                let md5Pasword = new Md5();
                let md5NewPasword = new Md5();
                this.postAsJsonAuth<ApiResponse<boolean>>({
                    method: "/api/v1.0/seguridad/reset_password",
                    preventLogin: true,
                    param: {
                        usuarioId: user_id,
                        password: null,
                        newPassword: md5NewPasword.appendStr(new_password).end(),
                        ip: '127.0.0.1',
                        usuarioLogueado: userSaved ? userSaved.userName : '',
                        resetPasswordRequestId: resetPasswordRequest
                    }
                }).then((response: ApiResponse<boolean>) => {
                    resolve(response.data);
                });
            });
        });
    }

    login(user: string, password: string, remind: boolean): Promise<IUserInfo> {
        return new Promise((resolve) => {
            let md5 = new Md5();
            this.postAsJson<ApiResponse<UsuarioDto>>({
                method: "/api/v1.0/seguridad/login",
                headers: {
                    "UserAppAuth": window.btoa(`${0}:${this.environmentConfig().applicationId}`)
                },
                param: {
                    Username: user,
                    Password: md5.appendStr(password).end()
                }
            }).then((response: ApiResponse<UsuarioDto>) => {
                let userResponse = response.data;
                let userInfo: IUserInfo = {
                    userId: userResponse.id,
                    firstName: userResponse.nombres,
                    lastName: userResponse.apellidos,
                    email: userResponse.email,
                    keyBodega: userResponse.keyBodega,
                    noCia: userResponse.noCia,
                    puntoVentaId: userResponse.puntoVentaId,
                    roles: userResponse.roles,
                    homeRoute: '/home',
                    completeName: userResponse.nombreCompleto,
                    documentoIdentidad: userResponse.documentoIdentidad,
                    phone: userResponse.telefono,
                    cellPhone: userResponse.celular,
                    state: userResponse.estado,
                    primerInicia: userResponse.primerInicio,
                    tipoDocumentoIdentidadId: userResponse.tipoDocumentoIdentidadId,
                    privilegio: new List<UsuarioPrivilegioDto>(userResponse.privilegios)
                        .Select<IPrivilegioDto>(x => {
                            return {
                                id: x.id,
                                aplicacionId: x.aplicacionId,
                                objetoAuthId: x.objetoAuthId,
                                objetoAuthPadreId: x.objetoAuthPadreId,
                                operacionId: x.operacionId,
                                rolId: x.rolId,
                            };
                        }).ToArray(),
                    userName: userResponse.username,
                    menu: this.moduleParseRec(userResponse.modulos),
                };
                let userNameToRemind = '';
                if (remind) {
                    userNameToRemind = user;
                }
                this.sessionProvider.setUserRemind(userNameToRemind);
                return this.sessionProvider.setUserInfo(userInfo).then((uInfo) => {
                    resolve(uInfo);
                });
            });
        });
    }
}
