
import { AuthBaseService } from "src/app/services/auth.base.service";
import { Injectable } from "@angular/core";
import { ResultPage } from "src/app/models/generic/Impl/ResultPage";
import { HttpClient } from "@angular/common/http";
import { SessionProvider } from "src/app/providers/session/session.provider";
import { ExecutingService } from "src/app/services/shared/executing.service";
import { ApiResponse } from "src/app/services/base.service";
import { ClienteFarmacorpDto } from "src/app/models/external/client/cliente-farmacorp-dto";
import { ObtenerClientesParam } from "src/app/models/external/client/obtener-clientes-param";

@Injectable()
export class ServiceClienteFarmacorp extends AuthBaseService {

    apiMethod: string = '/api/v1.0/cliente/search';

    constructor(
        public http: HttpClient,
        public sessionProvider: SessionProvider,
        public executingService: ExecutingService
    ) {
        super(http, sessionProvider, executingService);
    }

    search(param: ObtenerClientesParam): Promise<ResultPage<ClienteFarmacorpDto>> {
        return new Promise((resolve) => {
            this.postAsJson<ApiResponse<ResultPage<ClienteFarmacorpDto>>>({
                method: this.apiMethod,
                param: param
            }).then((response: ApiResponse<ResultPage<ClienteFarmacorpDto>>) => {
                resolve(response.data);
            });
        });
    }
}