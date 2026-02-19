import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { BehaviorSubject, Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { FilterResult, MarketplacesSettingService, PageParam } from "./marketplaces.service";
import { IMarketplaceSetting } from "src/app/models/markeplaces.models";

@Injectable()
export class MarketplaceSettingListadoDataSource implements DataSource<IMarketplaceSetting> {
  private ListadoSubject = new BehaviorSubject<IMarketplaceSetting[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();
  public resultPage: FilterResult<IMarketplaceSetting> = {};

  constructor(
    private _service: MarketplacesSettingService) {
  }

  loadListado(filter: PageParam) {
    this.loadingSubject.next(true);
    this._service.filter(filter).then((result: FilterResult<IMarketplaceSetting>) => {
      this.resultPage = result;
      this.ListadoSubject.next(result.data);
      this.loadingSubject.next(false);
    }).catch(() => {
      this.loadingSubject.next(false);
    });
  }

  connect(collectionViewer: CollectionViewer): Observable<IMarketplaceSetting[]> {
    return this.ListadoSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.ListadoSubject.complete();
    this.loadingSubject.complete();
  }
}
