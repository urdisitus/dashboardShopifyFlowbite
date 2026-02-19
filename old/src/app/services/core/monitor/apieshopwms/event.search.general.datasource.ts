import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { BehaviorSubject, Observable } from "rxjs";
import { ResultPage } from "src/app/models/generic/Impl/ResultPage";
import { Injectable } from "@angular/core";
import { List } from "linqts";
import { IEventSearchGeneralDto } from "src/app/dataTransferObjects/monitor/eshopwms/event.search.general.dto";
import { EShopWmsService } from "./eshopems.service";
import { IEventSearchGeneralFilterParam } from "src/app/dataTransferObjects/monitor/eshopwms/event.search.general.param";

@Injectable()
export class EventSearchGeneralDataSource implements DataSource<IEventSearchGeneralDto> {
  private dataResultSubject = new BehaviorSubject<IEventSearchGeneralDto[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();
  public resultPage: ResultPage<IEventSearchGeneralDto> = {};

  constructor(
    private _service: EShopWmsService) {
  }

  load(
    pageIndex: number,
    pageSize: number,
    param: IEventSearchGeneralFilterParam) {
    this.loadingSubject.next(true);
    this._service.filter({
      pageIndex: pageIndex,
      pageSize: pageSize,
      createDateEndUtc: param.createDateEndUtc,
      createDateStartUtc: param.createDateStartUtc,
      idRegistro: param.idRegistro,
      idShopifyBusiness: param.idShopifyBusiness,
      isAsc: true,
      keyEventStatus: param.keyEventStatus,
      keyTipo: param.keyTipo,
      keyTipoEventCode: param.keyTipoEventCode,
      textoBusqueda: param.textoBusqueda
    }).then((result: ResultPage<IEventSearchGeneralDto>) => {
      new List<IEventSearchGeneralDto>(result.elements).ForEach(x => {
        if (!x.dCreateDateUtcDate && x.createDateUtc) {
          x.dCreateDateUtcDate = new Date(x.createDateUtc);
        }
        if (!x.dEnvioDate && x.envioDate) {
          x.dEnvioDate = new Date(x.envioDate);
        }
        if (!x.dOrigenDate && x.origenDate) {
          x.dOrigenDate = new Date(x.origenDate);
        }
      });
      this.resultPage = result;
      this.dataResultSubject.next(result.elements);
      this.loadingSubject.next(false);
    }).catch(() => {
      this.loadingSubject.next(false);
    });
  }

  merge(list: IEventSearchGeneralDto[]) {
    new List<IEventSearchGeneralDto>(list).ForEach(x => {
      if (!x.dCreateDateUtcDate && x.createDateUtc) {
        x.dCreateDateUtcDate = new Date(x.createDateUtc);
      }
      if (!x.dEnvioDate && x.envioDate) {
        x.dEnvioDate = new Date(x.envioDate);
      }
      if (!x.dOrigenDate && x.origenDate) {
        x.dOrigenDate = new Date(x.origenDate);
      }
    });
    let exists = new List<IEventSearchGeneralDto>(this.resultPage.elements);
    let updates = new List<IEventSearchGeneralDto>(list);
    let elements: IEventSearchGeneralDto[] = [];
    exists.ForEach(x => {
      const element = updates.FirstOrDefault(y => y.idRegistro === x.idRegistro);
      if (element) {
        elements.push(element);
      } else {
        elements.push(x);
      }
    });
    this.resultPage.elements = elements;
    this.dataResultSubject.next(this.resultPage.elements);
  }

  connect(collectionViewer: CollectionViewer): Observable<IEventSearchGeneralDto[]> {
    return this.dataResultSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.dataResultSubject.complete();
    this.loadingSubject.complete();
  }
}
