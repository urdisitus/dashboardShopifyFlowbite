import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SessionProvider } from 'src/app/providers/session/session.provider';
import { ExecutingService } from '../shared/executing.service';
import { ApiResponse } from '../base.service';
import { SendNotificationParam } from '../../dataTransferObjects/notification/notificationDto';
import { JobAuthBaseService } from '../auth.base.service';

@Injectable()
export class ApiJobService extends JobAuthBaseService {

  constructor(
    public http: HttpClient,
    public sessionProvider: SessionProvider,
    public executingService: ExecutingService) {
    super(http, sessionProvider, executingService);
  }

  Send(param: SendNotificationParam): Promise<string> {
    var method: string = '/api/v1.0/notification/send';
    return new Promise((resolve) => {
      this.postAsJsonAuth<ApiResponse<string>>({
        method: method,
        param: param
      }).then((response: ApiResponse<string>) => {
        resolve(response.data);
      });
    });
  }
}
