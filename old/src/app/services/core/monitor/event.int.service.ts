import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FactucenAuthBaseService } from '../../auth.base.service';
import { ExecutingService } from '../../shared/executing.service';
import { SessionProvider } from 'src/app/providers/session/session.provider';
import { ApiResponse } from '../../base.service';
import { ResultPage } from 'src/app/models/generic/Impl/ResultPage';
import { IEventIntTypeDto } from 'src/app/dataTransferObjects/monitor/eventint/event.int.type.dto';
import { IEventIntStatusDto } from 'src/app/dataTransferObjects/monitor/eventint/event.int.status.dto';
import { ISimpleEventIntDto } from 'src/app/dataTransferObjects/monitor/eventint/simple.event.int.dto';
import { IEventIntDto } from 'src/app/dataTransferObjects/monitor/eventint/event.int.dto';
import { IFilterEventIntParam, IPaginationParam } from 'src/app/dataTransferObjects/monitor/eventint/filter.event.int.param';

@Injectable()

export class EventIntegrationService extends FactucenAuthBaseService {

    constructor(
        public http: HttpClient,
        public sessionProvider: SessionProvider,
        public executingService: ExecutingService
    ) {
        super(http, sessionProvider, executingService);
    }

    getTypes(): Promise<IEventIntTypeDto[]> {
        return new Promise((resolve) => {
            this.getAsJson<ApiResponse<IEventIntTypeDto[]>>({
                method: '/api/v1.0/eventointegracion/tipos',
                noShowLoading: true,
                noShowDialogError: true,
                noShowDialogLogicError: true
            }).then((response: ApiResponse<IEventIntTypeDto[]>) => {
                resolve(response.data);
            });
        });
    }

    getStatus(): Promise<IEventIntStatusDto[]> {
        return new Promise((resolve) => {
            this.getAsJson<ApiResponse<IEventIntStatusDto[]>>({
                method: '/api/v1.0/eventointegracion/estados',
                noShowLoading: true,
                noShowDialogError: true,
                noShowDialogLogicError: true
            }).then((response: ApiResponse<IEventIntStatusDto[]>) => {
                resolve(response.data);
            });
        });
    }

    reset(ids: number[]): Promise<ISimpleEventIntDto[]> {
        return new Promise((resolve) => {
            this.postAsJson<ApiResponse<ISimpleEventIntDto[]>>({
                method: '/api/v1.0/eventointegracion/reset',
                loadingMessage: 'Realizando reenvio de eventos...',
                param: {
                    data: ids
                }
            }).then((response: ApiResponse<ISimpleEventIntDto[]>) => {
                resolve(response.data);
            });
        });
    }

    filter(param: IPaginationParam<IFilterEventIntParam>): Promise<ResultPage<IEventIntDto>> {
        return new Promise((resolve) => {
            this.postAsJson<ApiResponse<ResultPage<IEventIntDto>>>({
                method: '/api/v1.0/eventointegracion/filter',
                loadingMessage: 'Obteniendo Eventos de Integración...',
                param: param
            }).then((response: ApiResponse<ResultPage<IEventIntDto>>) => {
                resolve(response.data);
            });
        });
    }

    filterResumen(param: IPaginationParam<IFilterEventIntParam>): Promise<ResultPage<IEventIntDto>> {
        return new Promise((resolve) => {
            this.postAsJson<ApiResponse<ResultPage<IEventIntDto>>>({
                method: '/api/v1.0/eventointegracion/filterResumen',
                loadingMessage: 'Obteniendo Eventos de Integración...',
                param: param
            }).then((response: ApiResponse<ResultPage<IEventIntDto>>) => {
                resolve(response.data);
            });
        });
    }
}
