import { Injectable } from '@angular/core';
import { SessionProvider } from 'src/app/providers/session/session.provider';
import { HttpClient } from '@angular/common/http';
import { ExecutingService } from 'src/app/services/shared/executing.service';
import { Md5 } from 'ts-md5/dist/md5';
import { ApiResponse, FactucenBaseService } from 'src/app/services/base.service';
import { KeyValue } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Injectable()
export class AuthPermissionService extends FactucenBaseService {
    constructor(
        public http: HttpClient,
        public sessionProvider: SessionProvider,
        public executingService: ExecutingService,
        private toastr: ToastrService,
        public router: Router
    ) {
        super(http, executingService);
    }

    verifyPermissionsByLogin(
        username: string,
        password: string,
        ...objetoAuthOperations: KeyValue<string, string>[]): Promise<IUserInfo> {
        let md5Pasword = new Md5();
        return this.verifyPermissions(
            '/api/v1.0/session/verify_permission/by_login',
            {
                username: username,
                password: md5Pasword.appendStr(password).end(),
                aplicacionId: this.environmentConfig().applicationId,
            }, objetoAuthOperations);
    }

    verifyPermissionsById(...objetoAuthOperations: KeyValue<string, string>[]): Promise<IUserInfo> {
        return new Promise((resolve) => {
            this.sessionProvider
                .getUserInfo()
                .then((userSaved: IUserInfo) => {
                    this.verifyPermissions(
                        '/api/v1.0/session/verify_permission/by_id',
                        {
                            usuarioId: userSaved.userId,
                            aplicacionId: this.environmentConfig().applicationId,
                        }, objetoAuthOperations)
                        .then(resolve);
                });
        });
    }

    verifyPermissions(
        url: string,
        param: any,
        objetoAuthOperations: KeyValue<string, string>[]): Promise<IUserInfo> {
        return new Promise((resolve) => {
            this.postAsJson<ApiResponse<IUserInfo>>({
                method: url,
                headers: {
                    'no_throw': 'true'
                },
                param: {
                    param: param,
                    objetoAuthOperations: objetoAuthOperations
                }
            }).then((response: ApiResponse<IUserInfo>) => {
                if (response.code === 0) {
                    resolve(response.data);
                } else {
                    if (response.errors) {
                        response.errors.forEach(error => this.toastr.error(error.message, 'Aviso'));
                    }
                    this.router.navigate(['/login']);
                }
            });
        });
    }
}
