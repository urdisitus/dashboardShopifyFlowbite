import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { SessionProvider } from "src/app/providers/session/session.provider";
import { AuthBaseService } from "src/app/services/auth.base.service";
import { ExecutingService } from "src/app/services/shared/executing.service";
import { ApiResponse } from "src/app/services/base.service";
import { environment } from "src/environments/environment";
import { IMarketplaceCompany, IMarketplaceItemMatchCode as IMarketplaceItemMatchCode, IMarketplaceItem, IMarketplaceStoreItemMatchCode, IMarketplaceStoreSetting, IMarketplaceSetting } from "src/app/models/markeplaces.models";
import { PagingResponse } from "src/app/modules/shared/services/base.service";

export class PageParam {
  param: any;
  length: number;
  start: number;
}

export class FilterResult<TData> {
  data?: TData[];
  start?: number;
  length?: number;
  filtered?: number;
  total?: number;
}

@Injectable()
export class MarketplacesItemMatchCodeService extends AuthBaseService {

  module: string = 'core';
  entity: string = 'item_match_code';

  constructor(
    public http: HttpClient,
    public sessionProvider: SessionProvider,
    public executingService: ExecutingService
  ) {
    super(http, sessionProvider, executingService);
  }

  protected endPointConfig() {
    return environment.configuration.marketplacesEndPoint;
  }

  getCompanies(): Promise<IMarketplaceCompany[]> {
    return this.getAsJson<IMarketplaceCompany[]>({
      method: "/api/core/company",
      noShowLoading: true,
      noShowDialogError: true,
      noShowDialogLogicError: true,
    });
  }

  getItems(criteria: string): Promise<IMarketplaceItem[]> {
    return new Promise((resolve) => {
      this.getAsJson<ApiResponse<IMarketplaceItem[]>>({
        method: "/api/core/item",
        noShowLoading: true,
        noShowDialogError: true,
        noShowDialogLogicError: true,
      }).then((response: ApiResponse<IMarketplaceItem[]>) => {
        resolve(response.data);
      });
    });
  }

  filter(param: PageParam): Promise<FilterResult<IMarketplaceItemMatchCode>> {
    return this.postAsJson<any>({
      method: `/api/${this.module}/${this.entity}/filter`,
      param: param
    });
  }

  list(param: any): Promise<IMarketplaceItemMatchCode[]> {
    return this.postAsJson<any>({
      method: `/api/${this.module}/${this.entity}/list`,
      param: param
    });
  }

  store(param: IMarketplaceStoreItemMatchCode): Promise<any> {
    return this.postAsJson<any>({
      method: `/api/${this.module}/${this.entity}`,
      param: param
    });
  }

  enable(id: string): Promise<any> {
    return this.putAsJson({
      method: `/api/${this.module}/${this.entity}/enable/${id}`
    });
  }

  disable(id: string): Promise<any> {
    return this.putAsJson({
      method: `/api/${this.module}/${this.entity}/disable/${id}`
    });
  }

  delete(id: string): Promise<any> {
    return this.deleteAsJson({
      method: `/api/${this.module}/${this.entity}/${id}`
    });
  }

  enableMassive(ids: string[]): Promise<any> {
    return this.postAsJson({
      method: `/api/${this.module}/${this.entity}/enable/massive`,
      param: ids
    });
  }

  disableMassive(ids: string[]): Promise<any> {
    return this.postAsJson({
      method: `/api/${this.module}/${this.entity}/disable/massive`,
      param: ids
    });
  }

  deleteMassive(ids: string[]): Promise<any> {
    return this.postAsJson({
      method: `/api/${this.module}/${this.entity}/delete/massive`,
      param: ids
    });
  }
}

@Injectable()
export class MarketplacesSettingService extends AuthBaseService {
  module: string = 'core';
  entity: string = 'setting';
  constructor(
    public http: HttpClient,
    public sessionProvider: SessionProvider,
    public executingService: ExecutingService
  ) {
    super(http, sessionProvider, executingService);
  }

  protected endPointConfig() {
    return environment.configuration.marketplacesEndPoint;
  }

  filter(param: PageParam): Promise<FilterResult<IMarketplaceSetting>> {
    return this.postAsJson<any>({
      method: `/api/${this.module}/${this.entity}/filter`,
      param: param
    });
  }

  list(param: any): Promise<IMarketplaceSetting[]> {
    return this.postAsJson<any>({
      method: `/api/${this.module}/${this.entity}/list`,
      param: param
    });
  }

  store(param: IMarketplaceStoreSetting): Promise<any> {
    return this.postAsJson<any>({
      method: `/api/${this.module}/${this.entity}`,
      param: param
    });
  }
}