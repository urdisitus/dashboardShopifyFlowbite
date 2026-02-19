import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { DatatableBase } from 'src/app/components/generic/component/datatable.base';
import { UsuarioListado } from 'src/app/models/security/administration/user/UsuarioListado';
import { UsuarioListadoDataSource } from 'src/app/services/security/administration/user/Impl/usuariolistado.datasource';
import { ServiceUser } from 'src/app/services/security/administration/user/Impl/user.service';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { fromEvent, merge } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { UserFormComponent } from '../user-form/user-form.component';
import { UsuarioDto } from 'src/app/services/security/session/Impl/session.service';
import { ResetpasswordComponent } from '../../resetpassword/resetpassword.component';
import { Utils } from 'src/app/providers/utils';
import { ToastrService } from 'ngx-toastr';
import { CommunicationService } from 'src/app/services/core/CommunicationService ';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent extends DatatableBase<UsuarioListado> implements OnInit, AfterViewInit {

  public _userDataSource: UsuarioListadoDataSource;
  public displayedColumns: string[] = ['actions', 'id', 'username', 'sucursal', 'nombreCompleto', 'cedula', 'telefono', 'celular', 'email'];
  public initialSize: number = 10;

  @ViewChild('inputCriteria') input: ElementRef;

  constructor(    
    private _toastr: ToastrService,
    private _serviceUser: ServiceUser,
    public _modalService: NgbModal) {
    super(_modalService);
    this._userDataSource = new UsuarioListadoDataSource(this._serviceUser);
  }

  ngOnInit(): void {
    this._userDataSource.loadUsuarioListado('', 0, this.initialSize);
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

  buildBrancOfficeId(usuario: UsuarioListado){
    if(usuario.keyBodega){
      return `${usuario.keyBodega} / ${usuario.puntoVentaId}`;
    }    
    return '';
  }

  loadUsuarioListadoPage() {
    this._userDataSource
      .loadUsuarioListado(this.input.nativeElement.value, this.paginator.pageIndex, this.paginator.pageSize);
  }

  create() {
    var newModal = this._modalService.open(UserFormComponent, {
      windowClass: 'animated slideInUp',
    });
    newModal.result.then((result: UsuarioDto) => {
      this.paginator.pageIndex = 0;
      this.loadUsuarioListadoPage();
    });
    return newModal;
  }

  edit(element: UsuarioListado) {
    var newModal = this._modalService.open(UserFormComponent, {
      windowClass: 'animated slideInUp',
    });
    newModal.componentInstance.setParam(element);
    newModal.result.then((result: UsuarioDto) => {
      this.paginator.pageIndex = 0;
      this.loadUsuarioListadoPage();
    });
    return newModal;
  }

  resetPassword(element: UsuarioListado) {
    var newModal = this._modalService.open(ResetpasswordComponent, {
      windowClass: 'animated slideInUp',
      size: 'sm'
    });
    newModal.componentInstance.setData(element);
    return newModal;
  }

  delete(element: UsuarioListado) {
    Utils.confirm(
      `¿Esta seguro que desea eliminar al usuario "${element.username}"?`,
      () => {
        this._serviceUser.deleteUser(element.id).then((result: any) => {
          this._toastr.success(`Se han eliminado el usuario "${element.username}" exitosamente.`, 'Eliminar Usuario');
          this.paginator.pageIndex = 0;          
          this.loadUsuarioListadoPage();
        });
      }
    )
  }
}
