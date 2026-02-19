import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { BehaviorSubject, Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { FilterResult, MarketplacesItemMatchCodeService, PageParam } from "./marketplaces.service";
import { IMarketplaceItemMatchCode } from "src/app/models/markeplaces.models";

@Injectable()
export class MarketplaceItemMatchCodeListadoDataSource implements DataSource<IMarketplaceItemMatchCode> {
  private ListadoSubject = new BehaviorSubject<IMarketplaceItemMatchCode[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();
  public resultPage: FilterResult<IMarketplaceItemMatchCode> = {};

  constructor(
    private _service: MarketplacesItemMatchCodeService) {
  }

  loadListado(filter: PageParam) {
    this.loadingSubject.next(true);
    this._service.filter(filter).then((result: FilterResult<IMarketplaceItemMatchCode>) => {
      this.resultPage = result;
      this.ListadoSubject.next(result.data);
      this.loadingSubject.next(false);
    }).catch(() => {
      this.loadingSubject.next(false);
    });
  }

  connect(collectionViewer: CollectionViewer): Observable<IMarketplaceItemMatchCode[]> {
    return this.ListadoSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.ListadoSubject.complete();
    this.loadingSubject.complete();
  }
}
