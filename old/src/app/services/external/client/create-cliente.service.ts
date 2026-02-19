import { AuthBaseService } from "src/app/services/auth.base.service";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { SessionProvider } from "src/app/providers/session/session.provider";
import { ExecutingService } from "src/app/services/shared/executing.service";
import { ApiResponse } from "src/app/services/base.service";
import { ClienteParam } from "src/app/models/external/client/cliente-param";
import { ClienteResult } from "src/app/models/external/client/cliente-result";

@Injectable()
export class ServiceCreateCliente extends AuthBaseService {

    apiMethod: string = '/api/v1.0/cliente/create';

    constructor(
        public http: HttpClient,
        public sessionProvider: SessionProvider,
        public executingService: ExecutingService
    ) {
        super(http, sessionProvider, executingService);
    }

    postCliente(param: ClienteParam): Promise<ClienteResult> {
        return new Promise((resolve) => {
            this.postAsJson<ApiResponse<ClienteResult>>({
                method: this.apiMethod,
                param: param
            }).then((response: ApiResponse<ClienteResult>) => {
                resolve(response.data);
            });
        });
    }
}