import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { SessionProvider } from "src/app/providers/session/session.provider";
import { ResultPage } from "src/app/models/generic/Impl/ResultPage";
import { IEventIntTypeDto } from "src/app/dataTransferObjects/monitor/eventint/event.int.type.dto";
import { IEventIntStatusDto } from "src/app/dataTransferObjects/monitor/eventint/event.int.status.dto";
import { ISimpleEventIntDto } from "src/app/dataTransferObjects/monitor/eventint/simple.event.int.dto";
import { IEventIntDto } from "src/app/dataTransferObjects/monitor/eventint/event.int.dto";
import {
  IFilterEventIntParam,
  IPaginationParam,
} from "src/app/dataTransferObjects/monitor/eventint/filter.event.int.param";
import { AuthBaseService } from "src/app/services/auth.base.service";
import { ExecutingService } from "src/app/services/shared/executing.service";
import { ApiResponse } from "src/app/services/base.service";
import { IEventcodesTypeDto } from "src/app/dataTransferObjects/monitor/eshopwms/eventcodes.types.dto";
import { IEventstatesTypeDto } from "src/app/dataTransferObjects/monitor/eshopwms/eventstates.types.dto";
import { IInfointegraTypeDto } from "src/app/dataTransferObjects/monitor/eshopwms/infointegra.types.dto";
import { IIntegradorGeneralDto } from "src/app/dataTransferObjects/monitor/eshopwms/integrador.general.dto";
import {
  IChangeEventStatusParam,
  IEventSearchGeneralParam,
} from "src/app/dataTransferObjects/monitor/eshopwms/event.search.general.param";
import { IEventSearchGeneralDto } from "src/app/dataTransferObjects/monitor/eshopwms/event.search.general.dto";
import { environment } from "src/environments/environment";
import { IEventcodesStatusCountDto } from "src/app/dataTransferObjects/monitor/eshopwms/eventcodes.status.count.dto";

@Injectable()
export class EShopWmsService extends AuthBaseService {
  constructor(
    public http: HttpClient,
    public sessionProvider: SessionProvider,
    public executingService: ExecutingService
  ) {
    super(http, sessionProvider, executingService);
  }

  protected endPointConfig() {
    return environment.configuration.apieshopwmsEndPoint;
  }

  getEventCodeTypes(): Promise<IEventcodesTypeDto[]> {
    return new Promise((resolve) => {
      this.getAsJson<ApiResponse<IEventcodesTypeDto[]>>({
        method: "/api/v1.0/monitor/setting/eventcodes/types",
        noShowLoading: true,
        noShowDialogError: true,
        noShowDialogLogicError: true,
      }).then((response: ApiResponse<IEventcodesTypeDto[]>) => {
        resolve(response.data);
      });
    });
  }

  getEventStatesTypes(): Promise<IEventstatesTypeDto[]> {
    return new Promise((resolve) => {
      this.getAsJson<ApiResponse<IEventstatesTypeDto[]>>({
        method: "/api/v1.0/monitor/setting/eventstates/types",
        noShowLoading: true,
        noShowDialogError: true,
        noShowDialogLogicError: true,
      }).then((response: ApiResponse<IEventstatesTypeDto[]>) => {
        resolve(response.data);
      });
    });
  }

  getInfoIntegraTypes(): Promise<IInfointegraTypeDto[]> {
    return new Promise((resolve) => {
      this.getAsJson<ApiResponse<IInfointegraTypeDto[]>>({
        method: "/api/v1.0/monitor/setting/infointegra/types",
        loadingMessage : "Obteniendo información",
        noShowLoading: false,
        noShowDialogError: false,
        noShowDialogLogicError: false,
      }).then((response: ApiResponse<IInfointegraTypeDto[]>) => {
        resolve(response.data);
      });
    });
  }

  getIntegradorGeneral(loading: boolean = true): Promise<IIntegradorGeneralDto[]> {
    return new Promise((resolve) => {
      this.getAsJson<ApiResponse<IIntegradorGeneralDto[]>>({
        method: "/api/v1.0/monitor/status/integrador/general",
        loadingMessage : "Obteniendo información",
        noShowLoading: loading,
        noShowDialogError: loading,
        noShowDialogLogicError: loading,
      }).then((response: ApiResponse<IIntegradorGeneralDto[]>) => {
        resolve(response.data);
      });
    });
  }

  filter(
    param: IEventSearchGeneralParam
  ): Promise<ResultPage<IEventSearchGeneralDto>> {
    return new Promise((resolve) => {
      this.postAsJson<ApiResponse<ResultPage<IEventSearchGeneralDto>>>({
        method: "/api/v1.0/monitor/event/search/general",
        loadingMessage: "Obteniendo Eventos de Integración...",
        param: param,
      }).then((response: ApiResponse<ResultPage<IEventSearchGeneralDto>>) => {
        resolve(response.data);
      });
    });
  }

  changeEventStatus(
    param: IChangeEventStatusParam
  ): Promise<IEventSearchGeneralDto> {
    return new Promise((resolve) => {
      this.postAsJson<ApiResponse<IEventSearchGeneralDto>>({
        method: "/api/v1.0/monitor/event/status/change",
        loadingMessage: "Cambiando estado...",
        param: param,
      }).then((response: ApiResponse<IEventSearchGeneralDto>) => {
        resolve(response.data);
      });
    });
  }

  getEventcodesStatusCount(loading: boolean = true): Promise<IEventcodesStatusCountDto[]> {
    return new Promise((resolve) => {
      this.getAsJson<ApiResponse<IEventcodesStatusCountDto[]>>({
        method: "/api/v1.0/monitor/eventcodes/status/count",
        loadingMessage : "Obteniendo información",
        noShowLoading: loading,
        noShowDialogError: loading,
        noShowDialogLogicError: loading,
      }).then((response: ApiResponse<IEventcodesStatusCountDto[]>) => {
        resolve(response.data);
      });
    });
  }
}
