import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { merge } from 'rxjs';
import { tap } from 'rxjs/operators';
import { HistoryItem } from '../../../dataTransferObjects/notification/notificationDto';
import { SessionProvider } from '../../../providers/session/session.provider';
import { ApiNotificationService } from '../../../services/notification/notification.service';
import { DatatableBase } from '../../generic/component/datatable.base';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import * as _moment from 'moment';
import { ActivatedRoute } from '@angular/router';
import { NotificationDetalleDataSource } from '../../../services/notification/history.datasource';

@Component({
  selector: 'app-history-detail',
  templateUrl: './history-detail.component.html',
  styleUrls: ['./history-detail.component.css']
})
export class HistoryDetailComponent extends DatatableBase<HistoryItem> implements OnInit, AfterViewInit {


  public displayedColumns: string[] = ['osType', 'version', 'email', 'phone', 'success', 'sended'];

  public _notiDataSource: NotificationDetalleDataSource;
  @Input()
  public IdCampania: number;

  @Input()
  public Id: string;
  public initialSize: number = 10;

  constructor(
    private _apiNotificationService: ApiNotificationService,
    private route: ActivatedRoute,
    public _modalService: NgbModal,
    public modal: NgbActiveModal,
    private _sesionUser: SessionProvider) {

    super(_modalService);

    this._notiDataSource = new NotificationDetalleDataSource(this._apiNotificationService);
    this.Id = this.route.snapshot.params.id;
    this.IdCampania = this.route.snapshot.params.campaign;
  }

  ngOnInit(): void {
    this._notiDataSource.loadListado(
      {
        index: 0,
        size: this.initialSize,
        app: 'shopify',
        campaignGroupId: this.Id
      });
  }

  dismissModal() {
    this.modal.dismiss('cancel click');
  }

  ngAfterViewInit(): void {
    merge(this.paginator.page)
      .pipe(
        tap(() => this.loadListadoPage())
      ).subscribe();
  }

  loadListadoPage() {
    this._notiDataSource.loadListado(
      {
        index: this.paginator.pageIndex,
        size: this.paginator.pageSize,
        app: 'shopify',
        campaignGroupId: this.Id
      });
  }

}
