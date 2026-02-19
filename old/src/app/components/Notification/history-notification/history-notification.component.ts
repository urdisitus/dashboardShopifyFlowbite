import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { fromEvent, merge } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { HistoryItem } from '../../../dataTransferObjects/notification/notificationDto';
import { SessionProvider } from '../../../providers/session/session.provider';
import { NotificationHistoryListadoDataSource } from '../../../services/notification/detalle.datasource';
import { ApiNotificationService } from '../../../services/notification/notification.service';
import { DatatableBase } from '../../generic/component/datatable.base';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import * as _moment from 'moment';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-history-notification',
  templateUrl: './history-notification.component.html',
  styleUrls: ['./history-notification.component.css'],
  preserveWhitespaces: true,
})
export class HistoryNotificationComponent extends DatatableBase<HistoryItem> implements OnInit, AfterViewInit {


  public displayedColumns: string[] = [ 'actions', 'sendDate', 'sendUser', 'jobId', 'name', 'segmentName', 'title', 'message', 'contentTypeId'];

  public _notiDataSource: NotificationHistoryListadoDataSource;
  @Input()
  public IdCampania: number;
  public initialSize: number = 10;

  @ViewChild('inputCriteria') input: ElementRef;

  public fechaInicial: Date = new Date();

  public fechaFinal: Date = new Date();

  constructor(
    private _apiNotificationService: ApiNotificationService,
    private route: ActivatedRoute,
    public router: Router,
    public _modalService: NgbModal,
    public modal: NgbActiveModal,
    private _sesionUser: SessionProvider) {

    super(_modalService);

    this._notiDataSource = new NotificationHistoryListadoDataSource(this._apiNotificationService);
    this.IdCampania = this.route.snapshot.params.campaign;

  }

  public ver(element: HistoryItem) {
    this.router.navigate(['/notification/history/detail', element.campaignId, element.uniqueCode])
  }


  ngOnInit(): void {
    this._notiDataSource.loadListado(
      {
        pageIndex: 0,
        pageSize: this.initialSize,
        startDate: this.dateToStringIni(this.fechaInicial),
        endDate: this.dateToStringFin(this.fechaFinal),
        camapaignId: this.IdCampania
      });
  }

  dismissModal() {
    this.modal.dismiss('cancel click');
  }

  ngAfterViewInit(): void {
    fromEvent(this.input.nativeElement, 'keyup')
      .pipe(
        debounceTime(150),
        distinctUntilChanged(),
        tap(() => {
          this.paginator.pageIndex = 0;
          this.loadListadoPage();
        })
      ).subscribe();

    merge(this.paginator.page)
      .pipe(
        tap(() => this.loadListadoPage())
      ).subscribe();
  }

  dateToStringIni(date: Date): string {
    if (!date) {
      return '';
    }
    return _moment(date).format('YYYY-MM-DDT00:00:00.000Z');
  }

  dateToStringFin(date: Date): string {
    if (!date) {
      return '';
    }
    return _moment(date).format('YYYY-MM-DDT23:59:59.999Z');
  }

  loadListadoPage() {
    this._notiDataSource.loadListado(
      {
        pageIndex: this.paginator.pageIndex,
        pageSize: this.paginator.pageSize,
        startDate: this.dateToStringIni(this.fechaInicial),
        endDate: this.dateToStringFin(this.fechaFinal),
        camapaignId: this.IdCampania
      });
  }


  public changeDate(param: any): void {
    this.paginator.pageIndex = 0;
    this.loadListadoPage();
  }
}
