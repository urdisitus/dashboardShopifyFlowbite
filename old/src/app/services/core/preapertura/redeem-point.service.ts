
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FactucenAuthBaseService } from '../../auth.base.service';
import { SessionProvider } from 'src/app/providers/session/session.provider';
import { ExecutingService } from '../../shared/executing.service';
import { ApiResponse } from '../../base.service';
import { FilterPageParam } from 'src/app/models/generic/FilterPageParam';
import { ResultPage } from 'src/app/models/generic/Impl/ResultPage';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, Observable } from 'rxjs';
import { IRedeemPointDto, IRedeemPointFilterParam, IRedeemPointGroupDto, IRedeemPointTypeDto, IStoreRedeemPointParam } from 'src/app/models/external/redeem-point/redeem-point-dto';

@Injectable()
export class RedeemPointService extends FactucenAuthBaseService {

    constructor(
        public http: HttpClient,
        public sessionProvider: SessionProvider,
        public executingService: ExecutingService) {
        super(http, sessionProvider, executingService);
    }

    filter(param: FilterPageParam<IRedeemPointFilterParam>): Promise<ResultPage<IRedeemPointDto>> {
        return new Promise((resolve) => {
            this.postAsJsonAuth<ApiResponse<ResultPage<IRedeemPointDto>>>({
                method: '/api/v1.0/redeem_point/filter',
                param: param
            }).then((response: ApiResponse<ResultPage<IRedeemPointDto>>) => {
                resolve(response.data);
            });
        });
    }

    store(param: IStoreRedeemPointParam): Promise<IRedeemPointDto> {
        return new Promise((resolve) => {
            this.sessionProvider.getUserInfo().then((user: IUserInfo) => {
                param.userId = user.userName;
                this.postAsJsonAuth<ApiResponse<IRedeemPointDto>>({
                    method: '/api/v1.0/redeem_point',
                    param: param
                }).then((response: ApiResponse<IRedeemPointDto>) => {
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
                    method: '/api/v1.0/redeem_point/' + id.toString(),
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

    types(): Promise<IRedeemPointTypeDto[]> {
        return new Promise((resolve) => {
            this.getAsJsonAuth<ApiResponse<IRedeemPointTypeDto[]>>({
                method: '/api/v1.0/redeem_point/types',
            }).then((response: ApiResponse<IRedeemPointTypeDto[]>) => {
                resolve(response.data);
            });
        });
    }

    groups(): Promise<IRedeemPointGroupDto[]> {
        return new Promise((resolve) => {
            this.getAsJsonAuth<ApiResponse<IRedeemPointGroupDto[]>>({
                method: '/api/v1.0/redeem_point/groups',
            }).then((response: ApiResponse<IRedeemPointGroupDto[]>) => {
                resolve(response.data);
            });
        });
    }
}

@Injectable()
export class RedeemPointDtoDataSource implements DataSource<IRedeemPointDto> {
    private subject = new BehaviorSubject<IRedeemPointDto[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);
    public loading$ = this.loadingSubject.asObservable();
    public resultPage: ResultPage<IRedeemPointDto> = {};

    constructor(
        private _service: RedeemPointService) {
    }

    load(
        filter: IRedeemPointFilterParam,
        pageIndex: number,
        pageSize: number) {
        this.loadingSubject.next(true);
        this._service.filter({
            pageIndex: pageIndex,
            pageSize: pageSize,
            param: filter
        }).then((result: ResultPage<IRedeemPointDto>) => {
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

    connect(collectionViewer: CollectionViewer): Observable<IRedeemPointDto[]> {
        return this.subject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.subject.complete();
        this.loadingSubject.complete();
    }
}