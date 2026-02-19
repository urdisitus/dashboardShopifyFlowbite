import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { BehaviorSubject, Observable } from "rxjs";
import { ResultPage } from "src/app/models/generic/Impl/ResultPage";
import { Injectable } from "@angular/core";
import { ApiNotificationService } from "./notification.service";
import { FilterNotification, NotificationDto } from "../../dataTransferObjects/notification/notificationDto";

@Injectable()
export class NotificationListadoDataSource implements DataSource<NotificationDto> {
  private ListadoSubject = new BehaviorSubject<NotificationDto[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);
    public loading$ = this.loadingSubject.asObservable();
  public resultPage: ResultPage<NotificationDto> = {};

    constructor(
      private _service: ApiNotificationService) {
    }

    loadListado(filter: FilterNotification) {
      this.loadingSubject.next(true);
      this._service.ListarCampania(filter).then((result: ResultPage<NotificationDto>) => {
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
