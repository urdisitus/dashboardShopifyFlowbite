import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { BehaviorSubject, Observable } from "rxjs";
import { ResultPage2 } from "src/app/models/generic/Impl/ResultPage";
import { Injectable } from "@angular/core";
import { ApiNotificationService } from "./notification.service";
import { DetailFilter, DetailsNotification} from "../../dataTransferObjects/notification/notificationDto";

@Injectable()
export class NotificationDetalleDataSource implements DataSource<DetailsNotification> {
  private ListadoSubject = new BehaviorSubject<DetailsNotification[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);
    public loading$ = this.loadingSubject.asObservable();
  public resultPage: ResultPage2<DetailsNotification> = {};

    constructor(
      private _service: ApiNotificationService) {
    }

  loadListado(filter: DetailFilter) {
      this.loadingSubject.next(true);
    this._service.ListarHistory(filter).then((result: ResultPage2<DetailsNotification>) => {
            this.resultPage = result;            
        this.ListadoSubject.next(result.data);
            this.loadingSubject.next(false);  
        }).catch(()=>{
            this.loadingSubject.next(false);  
        });
    }

  connect(collectionViewer: CollectionViewer): Observable<DetailsNotification[]> {
    return this.ListadoSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
      this.ListadoSubject.complete();
        this.loadingSubject.complete();
    }
}
