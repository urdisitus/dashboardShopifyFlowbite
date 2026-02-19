import { Component, OnInit } from '@angular/core';
import { StoreUserParam } from 'src/app/models/security/administration/params/store-user-param';
import { ServiceUser } from 'src/app/services/security/administration/user/Impl/user.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UsuarioDto } from 'src/app/services/security/session/Impl/session.service';
import { UsuarioListado } from 'src/app/models/security/administration/user/UsuarioListado';
import { IRolDto } from 'src/app/models/security/administration/user/Rol';
import { Select2OptionData } from 'ng-select2';
import { Options } from 'select2';
import { ToastrService } from 'ngx-toastr';
import { ServiceLocation } from 'src/app/services/external/location/location.service';
import { BranchOfficeDto } from 'src/app/models/external/location/BranchOfficeDto';
import { List } from 'linqts';
import { CommunicationService } from 'src/app/services/core/CommunicationService ';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css'],
  providers: [CommunicationService]
})
export class UserFormComponent implements OnInit {
  param: StoreUserParam = {};
  roles: IRolDto[] = [];
  rolesSelected: string = '';

  branchOfficeSelected: string = '';
  branchOffices: BranchOfficeDto[] = [];
  branchOfficesData: Array<Select2OptionData>;
  branchOfficesConfig: Options = {
    multiple: false,
    tags: false,
    closeOnSelect: true,
    width: 400
  };

  constructor(
    private communicationService: CommunicationService,
    private _toastr: ToastrService,
    public service: ServiceUser,
    public serviceLocation: ServiceLocation,
    public modal: NgbActiveModal
  ) {
    this.loadTypes();
  }

  updateRoles() {
    if (this.param && this.param.roles) {
      const rolesList = new List<string>(this.param.roles);
      this.rolesSelected = new List<IRolDto>(this.roles).Where(x => rolesList.Contains(x.id.toString())).Select(x => x.nombre).ToArray().join(', ');
    } else {
      this.rolesSelected = '';
    }
  }

  buildBrancOfficeId(noCia: string, keyBodega: string, puntoVentaId: number) {
    return `${noCia}_${keyBodega}_${puntoVentaId}`;
  }

  buildBrancOfficeName(keyBodega: string, puntoVentaId: number, nombre: string) {
    return `${keyBodega}/${puntoVentaId} ${nombre}`;
  }

  loadTypes() {
    this.service.roles().then((items: IRolDto[]) => {
      this.roles = items;
      this.updateRoles();
    });
    this.serviceLocation.get().then((items: BranchOfficeDto[]) => {
      this.branchOffices = items;
      this.branchOfficesData = [];
      for (let index = 0; index < this.branchOffices.length; index++) {
        const element = this.branchOffices[index];
        this.branchOfficesData.push({
          id: this.buildBrancOfficeId(element.noCia, element.keyBodega, element.puntoVentaId),
          text: this.buildBrancOfficeName(element.keyBodega, element.puntoVentaId, element.nombre)
        });
      }
    });
  }

  ngOnInit() {
  }

  dismissModal() {
    this.modal.dismiss('cancel click');
  }

  keyPress(event: KeyboardEvent) {
    const pattern = /[0-9]/;
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      // invalid character, prevent input
      event.preventDefault();
    }
  }

  setParam(param: UsuarioListado) {
    this.param.id = param.id;
    this.param.username = param.username;
    this.param.nombres = param.nombres;
    this.param.apellidos = param.apellidos;
    this.param.celular = param.celular;
    this.param.email = param.email;
    this.param.telefono = param.telefono;
    this.param.documentoIdentidad = param.documentoIdentidad;
    this.param.roles = param.roles;
    this.param.noCia = param.noCia;
    this.param.keyBodega = param.keyBodega;
    this.param.puntoVentaId = param.puntoVentaId;

    if (param.noCia && param.keyBodega) {
      this.branchOfficeSelected = this.buildBrancOfficeId(param.noCia, param.keyBodega, param.puntoVentaId);
    }
    this.updateRoles();
  }

  guardar() {
    const split = this.branchOfficeSelected.split('_');
    if (split.length == 3) {
      this.param.noCia = split[0];
      this.param.keyBodega = split[1];
      this.param.puntoVentaId = parseInt(split[2]);
    }
    this.service.store(this.param).then((result: UsuarioDto) => {
      this.service.sessionProvider.getUserInfo().then((userI: IUserInfo) => {
        if (userI.userId == result.id) {
          this.communicationService.emitChange();
        }
      });
      this._toastr.success(`Se han guardado el usuario "${this.param.username}" exitosamente.`, 'Guardar Usuario');
      this.modal.close(result);
      this.dismissModal();
    });
  }
}
