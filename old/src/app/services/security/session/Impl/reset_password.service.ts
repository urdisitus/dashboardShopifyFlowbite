import { Injectable } from '@angular/core';
import { SessionProvider } from 'src/app/providers/session/session.provider';
import { ApiResponse } from 'src/app/services/base.service';
import { HttpClient } from '@angular/common/http';
import { ExecutingService } from 'src/app/services/shared/executing.service';
import { FactucenAuthBaseService } from 'src/app/services/auth.base.service';
import { IResetPasswordRequestDto } from 'src/app/models/security/session/reset.password.request.dto';
import { ErrorResponse } from 'src/app/dataTransferObjects/Base.Response';

@Injectable()
export class ResetPasswordService extends FactucenAuthBaseService {

    constructor(
        public http: HttpClient,
        public sessionProvider: SessionProvider,
        public executingService: ExecutingService
    ) {
        super(http, sessionProvider, executingService);
    }

    getResetPasswordRequest(token: string, logicErrorCallback: (code: string, message: string, errors: ErrorResponse[]) => void): Promise<IResetPasswordRequestDto> {
        return new Promise((resolve) => {
            this.getAsJsonAuth<ApiResponse<IResetPasswordRequestDto>>({
                method: "/api/v1.0/session/password/get/" + token,
                preventLogin: true,
                logicErrorCallback: logicErrorCallback
            }).then((response: ApiResponse<IResetPasswordRequestDto>) => {
                resolve(response.data);
            });
        });
    }

    resetPasswordRequest(user: string): Promise<string> {
        return new Promise((resolve) => {
            this.postAsJsonAuth<ApiResponse<string>>({
                method: "/api/v1.0/session/password/request",
                preventLogin: true,
                param: {
                    Data: user
                }
            }).then((response: ApiResponse<string>) => {
                resolve(response.data);
            });
        });
    }
}
