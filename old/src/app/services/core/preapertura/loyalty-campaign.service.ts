
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FactucenAuthBaseService } from '../../auth.base.service';
import { SessionProvider } from 'src/app/providers/session/session.provider';
import { ExecutingService } from '../../shared/executing.service';
import { ApiResponse } from '../../base.service';
import { FilterPageParam } from 'src/app/models/generic/FilterPageParam';
import { ILoyaltyCampaignDto, ILoyaltyCampaignFilterParam, ILoyaltyCampaignRuleTypeDto, IStoreLoyaltyCampaignParam } from 'src/app/models/external/loyalty-campaign/loyalty-campaign-dto';
import { ResultPage } from 'src/app/models/generic/Impl/ResultPage';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class LoyaltyCampaignService extends FactucenAuthBaseService {

    constructor(
        public http: HttpClient,
        public sessionProvider: SessionProvider,
        public executingService: ExecutingService) {
        super(http, sessionProvider, executingService);
    }

    filter(param: FilterPageParam<ILoyaltyCampaignFilterParam>): Promise<ResultPage<ILoyaltyCampaignDto>> {
        return new Promise((resolve) => {
            this.postAsJsonAuth<ApiResponse<ResultPage<ILoyaltyCampaignDto>>>({
                method: '/api/v1.0/loyalty_campaign/filter',
                param: param
            }).then((response: ApiResponse<ResultPage<ILoyaltyCampaignDto>>) => {
                resolve(response.data);
            });
        });
    }

    store(param: IStoreLoyaltyCampaignParam): Promise<ILoyaltyCampaignDto> {
        return new Promise((resolve) => {
            this.sessionProvider.getUserInfo().then((user: IUserInfo) => {
                param.userId = user.userName;
                this.postAsJsonAuth<ApiResponse<ILoyaltyCampaignDto>>({
                    method: '/api/v1.0/loyalty_campaign',
                    param: param
                }).then((response: ApiResponse<ILoyaltyCampaignDto>) => {
                    resolve(response.data);
                });
            })
        });
    }

    detele(id: number): Promise<any> {
        return this.changeStatus(id, 2);
    }

    enable(id: number): Promise<any> {
        return this.changeStatus(id, 1);
    }

    disable(id: number): Promise<any> {
        return this.changeStatus(id, 0);
    }

    changeStatus(id: number, status: number): Promise<any> {
        return new Promise((resolve) => {
            this.sessionProvider.getUserInfo().then((user: IUserInfo) => {
                super.putAsJson({
                    method: '/api/v1.0/loyalty_campaign/' + id.toString(),
                    param: {
                        status: status,
                        userId: user.userName
                    }
                }).then((response: any) => {
                    resolve(response.data);
                });
            });
        });
    }

    ruleTypes(): Promise<ILoyaltyCampaignRuleTypeDto[]> {
        return new Promise((resolve) => {
            this.getAsJsonAuth<ApiResponse<ILoyaltyCampaignRuleTypeDto[]>>({
                method: '/api/v1.0/loyalty_campaign_rule_type',
            }).then((response: ApiResponse<ILoyaltyCampaignRuleTypeDto[]>) => {
                resolve(response.data);
            });
        });
    }
}

@Injectable()
export class LoyaltyCampaignDtoDataSource implements DataSource<ILoyaltyCampaignDto> {
    private subject = new BehaviorSubject<ILoyaltyCampaignDto[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);
    public loading$ = this.loadingSubject.asObservable();
    public resultPage: ResultPage<ILoyaltyCampaignDto> = {};

    constructor(
        private _service: LoyaltyCampaignService) {
    }

    load(
        filter: ILoyaltyCampaignFilterParam,
        pageIndex: number,
        pageSize: number) {
        this.loadingSubject.next(true);
        this._service.filter({
            pageIndex: pageIndex,
            pageSize: pageSize,
            param: filter
        }).then((result: ResultPage<ILoyaltyCampaignDto>) => {
            result.elements.forEach(x => {
                if (x.startDate != null) {
                    x.startDateD = new Date(x.startDate);
                }
                if (x.endDate != null) {
                    x.endDateD = new Date(x.endDate);
                }
            });
            this.resultPage = result;
            this.subject.next(result.elements);
            this.loadingSubject.next(false);
        }).catch(() => {
            this.loadingSubject.next(false);
        });
    }

    connect(collectionViewer: CollectionViewer): Observable<ILoyaltyCampaignDto[]> {
        return this.subject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.subject.complete();
        this.loadingSubject.complete();
    }
}