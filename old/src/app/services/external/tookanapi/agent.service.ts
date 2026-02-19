import { FetchCoordinatesResponse } from './../../../models/external/tookanApi/agent/fetch-coordinates-response';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ExecutingService } from '../../shared/executing.service';
import { ApiResponse, TookanApiBaseService } from '../../base.service';
import { AgentDetailDto } from 'src/app/models/external/tookanApi/agent/agent-detail-dto';
import { AgentLocationDto } from 'src/app/models/external/tookanApi/agent/agent-location-dto';

@Injectable()
export class AgentService extends TookanApiBaseService {

  constructor(
    public http: HttpClient,
    public executingService: ExecutingService) {
    super(http, executingService);
  }

  getDetail1(agentId: string): Promise<AgentDetailDto> {
    var method: string = '/api/v1.0/tookan/agent/' + agentId;
    return new Promise((resolve) => {
      this.getAsJson<ApiResponse<AgentDetailDto>>({
        method: method,
        noShowLoading: true,
        noShowDialogError: true
      }).then((response: ApiResponse<AgentDetailDto>) => {
        resolve(response.data);
      });
    });
  }

  getLocation(agentId: string, noShowLoadingL: boolean): Promise<AgentLocationDto> {
    var method: string = '/api/v1.0/tookan/agent/location/' + agentId;
    return new Promise((resolve) => {
      this.getAsJson<ApiResponse<AgentLocationDto>>({
        method: method,
        noShowLoading: noShowLoadingL,
        noShowDialogError: true
      }).then((response: ApiResponse<AgentLocationDto>) => {
        resolve(response.data);
      });
    });
  }

  fetchCoordinates(orderNameId: string, noShowLoadingL: boolean): Promise<FetchCoordinatesResponse> {
    var method: string = '/api/v1.0/beetrack/dispatch/fetch/coordinates/' + orderNameId;
    return new Promise((resolve) => {
      this.getAsJson<ApiResponse<FetchCoordinatesResponse>>({
        method: method,
        noShowLoading: noShowLoadingL,
        noShowDialogError: true
      }).then((response: ApiResponse<FetchCoordinatesResponse>) => {
        resolve(response.data);
      });
    });
  }
}
