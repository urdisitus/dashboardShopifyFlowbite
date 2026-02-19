import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PreaperturaResult } from 'src/app/dataTransferObjects/preapertura/preapertura';
import { SessionProvider } from 'src/app/providers/session/session.provider';
import { SaveCampanaAsignacionStickerView } from 'src/app/dataTransferObjects/preapertura/save-campana-asignacion-sticker';
import { ExecutingService } from '../shared/executing.service';
import { ApiResponse } from '../base.service';
import { ResultPage, ResultPage2 } from '../../models/generic/Impl/ResultPage';
import { CampaignContentType, DetailFilter, DetailsNotification, FilterHistory, FilterNotification, HistoryItem, NotificationDto, NotificationParam, PaginateCampaignSegment } from '../../dataTransferObjects/notification/notificationDto';
import { AuthBaseService } from '../auth.base.service';

@Injectable()
export class ApiNotificationService extends AuthBaseService  {

  constructor(
    public http: HttpClient,
    public sessionProvider: SessionProvider,
    public executingService: ExecutingService) {
    super(http, sessionProvider, executingService);
  }

  ListarCampania(param: FilterNotification): Promise<ResultPage<NotificationDto>> {
    var method: string = '/api/v1.0/notif/campaign/list';
    return new Promise((resolve) => {
      this.postAsJsonAuth<ApiResponse<ResultPage<NotificationDto>>>({
        method: method,
        param: param
      }).then((response: ApiResponse<ResultPage<NotificationDto>>) => {
        resolve(response.data);
      });
    });
  }

  ListarDetalle(param: FilterHistory): Promise<ResultPage<HistoryItem>> {
    var method: string = '/api/v1.0/notif/campaign/history/list';
    return new Promise((resolve) => {
      this.postAsJsonAuth<ApiResponse<ResultPage<HistoryItem>>>({
        method: method,
        param: param
      }).then((response: ApiResponse<ResultPage<HistoryItem>>) => {
        resolve(response.data);
      });
    });
  }

  ListarHistory(param: DetailFilter): Promise<ResultPage2<DetailsNotification>> {
    var method: string = '/api/v1.0/notification/receipt/report';
    return new Promise((resolve) => {
      this.postAsJsonAuth<ApiResponse<ResultPage2<DetailsNotification>>>({
        method: method,
        param: param
      }).then((response: ApiResponse<ResultPage2<DetailsNotification>>) => {
        resolve(response.data);
      });
    });
  }

  ListarSegmentos(limit: number): Promise<PaginateCampaignSegment> {
    var method: string = '/api/v1.0/notification/segments';
    return new Promise((resolve) => {
      this.postAsJsonAuth<ApiResponse<PaginateCampaignSegment>>({
        method: method,
        param: { limit: limit, next: true, pageInfo: '' }
      }).then((response: ApiResponse<PaginateCampaignSegment>) => {
        resolve(response.data);
      });
    });
  }

  ListarContentType(): Promise<CampaignContentType[]> {
    var method: string = '/api/v1.0/notif/campaign/contenttype';
    return new Promise((resolve) => {
      this.getAsJsonAuth<ApiResponse<CampaignContentType[]>>({
        method: method
      }).then((response: ApiResponse<CampaignContentType[]>) => {
        resolve(response.data);
      });
    });
  }

  guardarCampania(param: NotificationParam): Promise<NotificationDto> {
    var method: string = '/api/v1.0/notif/campaign';
    return new Promise((resolve) => {
      this.postAsJsonAuth<ApiResponse<NotificationDto>>({
        method: method,
        param: param
      }).then((response: ApiResponse<NotificationDto>) => {
        resolve(response.data);
      });
    });
  }

  asignar(param: SaveCampanaAsignacionStickerView): Promise<PreaperturaResult> {
    var method: string = '/api/v1.0/campana/asignar';
    param.keySource = this.environmentConfig().keySource;
    return new Promise((resolve) => {
      this.postAsJsonAuth<ApiResponse<PreaperturaResult>>({
        method: method,
        param: param
      }).then((response: ApiResponse<PreaperturaResult>) => {
        resolve(response.data);
      });
    });
  }

  EliminarCampania(id: number, user: string): Promise<boolean> {
    var method: string = '/api/v1.0/notif/campaign/delete';
    method = method.replace('{id}', id.toString());
    return new Promise((resolve) => {
      this.postAsJsonAuth({
        method: method,
        param: { userId: user, id: id }
      }).then((response: ApiResponse<boolean>) => {
        resolve(response.data);
      });
    });
  }

  EnableCampania(id: number, user: string): Promise<boolean> {
    var method: string = '/api/v1.0/notif/campaign/enable';
    method = method.replace('{id}', id.toString());
    return new Promise((resolve) => {
      this.postAsJsonAuth({
        method: method,
        param: { userId: user, id: id }
      }).then((response: ApiResponse<boolean>) => {
        resolve(response.data);
      });
    });
  }

  DisableCampania(id: number, user: string): Promise<boolean> {
    var method: string = '/api/v1.0/notif/campaign/disable';
    method = method.replace('{id}', id.toString());
    return new Promise((resolve) => {
      this.postAsJsonAuth({
        method: method,
        param: { userId: user, id: id }
      }).then((response: ApiResponse<boolean>) => {
        resolve(response.data);
      });
    });
  }

}

