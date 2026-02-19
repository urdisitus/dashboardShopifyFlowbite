import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { BehaviorSubject, Observable } from "rxjs";
import { ResultPage } from "src/app/models/generic/Impl/ResultPage";
import { Injectable } from "@angular/core";
import { ApiNotificationService } from "./notification.service";
import { FilterHistory, FilterNotification, HistoryItem, NotificationDto } from "../../dataTransferObjects/notification/notificationDto";

@Injectable()
export class NotificationHistoryListadoDataSource implements DataSource<HistoryItem> {
  private ListadoSubject = new BehaviorSubject<HistoryItem[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);
    public loading$ = this.loadingSubject.asObservable();
  public resultPage: ResultPage<HistoryItem> = {};

    constructor(
      private _service: ApiNotificationService) {
    }

  loadListado(filter: FilterHistory) {
      this.loadingSubject.next(true);
    this._service.ListarDetalle(filter).then((result: ResultPage<HistoryItem>) => {
            this.resultPage = result;            
        this.ListadoSubject.next(result.elements);
            this.loadingSubject.next(false);  
        }).catch(()=>{
            this.loadingSubject.next(false);  
        });
    }

  connect(collectionViewer: CollectionViewer): Observable<NotificationDto[]> {
    return this.ListadoSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
      this.ListadoSubject.complete();
        this.loadingSubject.complete();
    }
}
