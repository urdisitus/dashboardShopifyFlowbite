import { AuthBaseService } from "src/app/services/auth.base.service";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { SessionProvider } from "src/app/providers/session/session.provider";
import { ExecutingService } from "src/app/services/shared/executing.service";
import { ApiResponse } from "src/app/services/base.service";
import { BranchOfficeDto } from "src/app/models/external/location/BranchOfficeDto";

@Injectable()
export class ServiceLocation extends AuthBaseService {

    apiMethod: string = '/api/v1.0/location';    

    constructor(
        public http: HttpClient,
        public sessionProvider: SessionProvider,
        public executingService: ExecutingService
    ) {
        super(http, sessionProvider, executingService);
    }

    get(): Promise<BranchOfficeDto[]> {        
        return new Promise((resolve) => {
            this.getAsJsonAuth<ApiResponse<BranchOfficeDto[]>>({
                method: this.apiMethod
            }).then((response: ApiResponse<BranchOfficeDto[]>) => {
                resolve(response.data);
            });
        });
    }
}