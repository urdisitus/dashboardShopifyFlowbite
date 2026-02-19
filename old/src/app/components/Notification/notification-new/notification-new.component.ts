import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ServiceUser } from '../../../services/security/administration/user/Impl/user.service';
import { UsuarioDto } from '../../../services/security/session/Impl/session.service';
import { CampaignContentType, CampaignSegment, NotificationDto, NotificationParam } from '../../../dataTransferObjects/notification/notificationDto';
import { ApiNotificationService } from '../../../services/notification/notification.service';

@Component({
  selector: 'app-notification-new',
  templateUrl: './notification-new.component.html',
  styleUrls: ['./notification-new.component.css']
})
export class NotificationNewComponent implements OnInit {
  @Input()
  public isNew: boolean = true;
  public toggled: boolean = false;

  public osTypes = [
    {
      value: "android,ios", description: 'Todos'
    },
    {
      value: 'ios', description: 'Solo iOS'
    },
    {
      value: 'android', description: 'Solo Android'
    }
  ];

  @Input()
  public param: NotificationDto = {};
  public segmentos: CampaignSegment[] = [];
  public tipos: CampaignContentType[];

  public contentDescription: string = '';


  constructor(
    private _apiNotificationService: ApiNotificationService,
    private _toastr: ToastrService,
    public service: ServiceUser,
    public modal: NgbActiveModal
  ) {
  }

  public handleSelection(event): void {
    if (this.param.message === undefined)
      this.param.message = '';
    this.param.message += event.char;
    this.toggled = false;
  }

  public ngOnInit(): void {
    if (this.param) {
      if (this.param.osTypes && this.param.osTypes.length > 1) {
        this.param.tmpOsTypes = 'android,ios';
      }
    }
    this.loadSegment();
    this.loadTipos();
  }

  dismissModal() {
    this.modal.dismiss('cancel click');
  }

  public loadSegment(): void {
    this._apiNotificationService.ListarSegmentos(100)
      .then(
        (result) => {
          this.segmentos = result.data;
        }
      );
  }

  public loadTipos(): void {
    this._apiNotificationService.ListarContentType()
      .then(
        (result) => {
          this.tipos = result;
        }
      );
  }

  public changeSegment(param: any): void {
    this.param.segmentId = param.value;
  }


  public changeTipo(param: any): void {
    this.contentDescription = this.tipos.find(e => e.id == param.value).descript;
    this.param.contentTypeId = param.value;
  }

  public osType(param: any): void {
    this.param.tmpOsTypes = param.value;
  }

  public guardar(): void {
    var segmento = this.segmentos.find(e => e.id == this.param.segmentId);
    this.service.sessionProvider.getUserInfo().then((user: IUserInfo) => {
      this.param.osTypes = [];
      if (this.param.tmpOsTypes !== "android,ios") {
        this.param.osTypes.push(this.param.tmpOsTypes);
      }else{
        this.param.osTypes.push('android');
        this.param.osTypes.push('ios');
      }
      var notif: NotificationParam =
      {
        id: this.isNew ? 0 : this.param.id,
        name: this.param.name,
        segmentId: segmento ? segmento.id : null,
        segmentName: segmento ? segmento.name : null,
        segmentQuery: segmento ? segmento.query : null,
        title: this.param.title,
        message: this.param.message,
        contentTypeId: this.param.contentTypeId,
        contentCode: this.param.contentCode,
        user: user.userName,
        osTypes: this.param.osTypes
      };
      this._apiNotificationService.guardarCampania(notif).then((result: UsuarioDto) => {
        this._toastr.success(`Se han guardado la campaña "${this.param.name}" exitosamente.`, 'Guardar campaña');
        this.modal.close(result);
        this.dismissModal();
      });
    });
  }
}
