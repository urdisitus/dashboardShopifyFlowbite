import { Component, ViewChild, OnInit, ElementRef, AfterViewInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ApiArqueoService } from 'src/app/services/core/preapertura/arqueo.service';
import { PreaperturaResult, CampanaResult } from 'src/app/dataTransferObjects/preapertura/preapertura';
import { Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { DateAdapter, MatSelect, MAT_DATE_FORMATS, MAT_DATE_LOCALE, } from '@angular/material';
import { SessionProvider } from 'src/app/providers/session/session.provider';
import { MatTableDataSource } from '@angular/material/table';
import { DatatableBase } from '../../generic/component/datatable.base';

// Depending on whether rollup is used, moment needs to be imported differently.
// Since Moment.js doesn't have a default export, we normally need to import using the `* as`
// syntax. However, rollup creates a synthetic default module and we thus need to import it using
// the `default as` syntax.
import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import { defaultFormat as _rollupMoment } from 'moment';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { NotificationNewComponent } from '../notification-new/notification-new.component';
import { ApiNotificationService } from '../../../services/notification/notification.service';
import { ResultPage } from '../../../models/generic/Impl/ResultPage';
import { NotificationDto } from '../../../dataTransferObjects/notification/notificationDto';
import { NotificationListadoDataSource } from '../../../services/notification/notification.datasource';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { fromEvent, merge } from 'rxjs';
import { element } from 'protractor';
import { Utils } from '../../../providers/utils';
import { ApiJobService } from '../../../services/notification/notification.job.service';
import { HistoryNotificationComponent } from '../history-notification/history-notification.component';

const moment = _rollupMoment || _moment;

// See the Moment.js docs for the meaning of these formats:
// https://momentjs.com/docs/#/displaying/format/
export const MY_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
};

@Component({
  selector: 'app-notificaciones',
  templateUrl: './notificaciones.component.html',
  styleUrls: ['./notificaciones.component.css'],
  preserveWhitespaces: true,
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class NotificacionesComponent extends DatatableBase<PreaperturaResult> implements OnInit, AfterViewInit {


  public displayedColumns: string[] = ['actions', 'id', 'name', 'editUser', 'title', 'message', 'contentTypeId', 'segmentName'];

  public _notiDataSource: NotificationListadoDataSource;

  public initialSize: number = 10;

  @ViewChild('inputCriteria') input: ElementRef;

  constructor(
    private _apiNotificationService: ApiNotificationService,
    public _modalService: NgbModal,
    public _jobService: ApiJobService,
    private _toastr: ToastrService,
    public router: Router,
    private _sesionUser: SessionProvider) {

    super(_modalService);

    this._notiDataSource = new NotificationListadoDataSource(this._apiNotificationService);

  }

  ngOnInit(): void {
    this._notiDataSource.loadListado({ pageIndex: 0, pageSize: this.initialSize });
  }

  public setStatus(event: any, id: number): void {

    var i = this._notiDataSource.resultPage.elements.findIndex(e => e.id === id);

    if (this._notiDataSource.resultPage.elements[i].status === 0) {
      this.enable(this._notiDataSource.resultPage.elements[i]);
    } else {
      this.disable(this._notiDataSource.resultPage.elements[i]);
    }

  }

  ngAfterViewInit(): void {
    fromEvent(this.input.nativeElement, 'keyup')
      .pipe(
        debounceTime(150),
        distinctUntilChanged(),
        tap(() => {
          this.paginator.pageIndex = 0;
          this.loadUsuarioListadoPage();
        })
      ).subscribe();

    merge(this.paginator.page)
      .pipe(
        tap(() => this.loadUsuarioListadoPage())
      ).subscribe();
  }

  loadUsuarioListadoPage() {
    this._notiDataSource
      .loadListado({
        criteria: this.input.nativeElement.value,
        pageIndex: this.paginator.pageIndex,
        pageSize: this.paginator.pageSize,
      });
  }

  public create(): any {
    var newModal = this._modalService.open(NotificationNewComponent, {
      windowClass: 'animated slideInUp',
    });
    newModal.result.then(result => {
      this.paginator.pageIndex = 0;
      this.loadUsuarioListadoPage();
    });
    return newModal;
  }

  public send(element: NotificationDto): void {
    Utils.confirm(
      `¿Esta seguro que desea enviar notificaciones de la campaña "${element.name}"?`,
      () => {
        this._sesionUser.getUserInfo().then((user: IUserInfo) => {
          this._jobService.Send({
            campaignId: element.id,
            contentCode: element.contentCode,
            contentTypeId: element.contentTypeId,
            message: element.message,
            name: element.name,
            segmentId: element.segmentId,
            segmentName: element.segmentName,
            sendUser: user.userName,
            title: element.title,
            segmentQuery: element.segmentQuery,
            osTypes: element.osTypes
          }).then((result) => {
            if (result) {
              this._toastr.success(`Se enviaron notifiaciones la campaña "${element.name}" exitosamente.`, 'Habilitar campaña');
              this.paginator.pageIndex = 0;
              this.loadUsuarioListadoPage();
            }
          });
        });
      },
      () => {
        this.paginator.pageIndex = 0;
        this.loadUsuarioListadoPage();
      }
    )
  }

  public edit(element: NotificationDto): any {
    var newModal = this._modalService.open(NotificationNewComponent, {
      windowClass: 'animated slideInUp',
    });
    newModal.componentInstance.param = {
      name: element.name,
      segmentId: element.segmentId,
      segmentName: element.segmentName,
      segmentQuery: element.segmentQuery,
      title: element.title,
      message: element.message,
      contentTypeId: element.contentTypeId,
      contentCode: element.contentCode,
      status: element.status,
      createDate: element.createDate,
      editDate: element.editDate,
      createUser: element.createUser,
      editUser: element.editUser,
      osTypes: element.osTypes,
      id: element.id
    };
    newModal.componentInstance.isNew = false;
    newModal.result.then((result) => {
      this.paginator.pageIndex = 0;
      this.loadUsuarioListadoPage();
    });
    return newModal;
  }

  public historyDetails(element: NotificationDto) {
    this.router.navigate(['/notification/history', element.id])
  }

  delete(element: any) {
    Utils.confirm(
      `¿Esta seguro que desea eliminar la campaña "${element.name}"?`,
      () => {


        this._sesionUser.getUserInfo().then((user: IUserInfo) => {

          this._apiNotificationService.EliminarCampania(element.id, user.userName).then((result) => {

            if (result) {
              this._toastr.success(`Se ha eliminado la campaña "${element.name}" exitosamente.`, 'Eliminar campaña');
              this.paginator.pageIndex = 0;
              this.loadUsuarioListadoPage();
            }
          });
        });
      }
    )
  }

  enable(element: any) {
    Utils.confirm(
      `¿Esta seguro que desea habilitar la campaña "${element.name}"?`,
      () => {


        this._sesionUser.getUserInfo().then((user: IUserInfo) => {

          this._apiNotificationService.EnableCampania(element.id, user.userName).then((result) => {

            if (result) {

              this._toastr.success(`Se han habilitado la campaña "${element.name}" exitosamente.`, 'Habilitar campaña');
              this.paginator.pageIndex = 0;
              this.loadUsuarioListadoPage();
            }
          });
        });
      },
      () => {
        this.paginator.pageIndex = 0;
        this.loadUsuarioListadoPage();
      }
    )
  }

  disable(element: any) {
    Utils.confirm(
      `¿Esta seguro que desea inhabilitar la campaña "${element.name}"?`,
      () => {
        this._sesionUser.getUserInfo().then((user: IUserInfo) => {
          this._apiNotificationService.DisableCampania(element.id, user.userName).then((result) => {
            if (result) {
              this._toastr.success(`Se ha inhabilitar la campaña "${element.name}" exitosamente.`, 'Inhabilitar campaña');
              this.paginator.pageIndex = 0;
              this.loadUsuarioListadoPage();
            }
          });
        });
      },
      () => {
        this.paginator.pageIndex = 0;
        this.loadUsuarioListadoPage();
      }
    )
  }

}
