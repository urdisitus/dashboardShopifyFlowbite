import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatatableBase } from 'src/app/components/generic/component/datatable.base';
import { UsuarioListado } from 'src/app/models/security/administration/user/UsuarioListado';
import { ServiceUser } from 'src/app/services/security/administration/user/Impl/user.service';
import { UsuarioListadoDataSource } from 'src/app/services/security/administration/user/Impl/usuariolistado.datasource';
import { fromEvent, merge } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';

@Component({
  selector: 'app-buscar-usuario',
  templateUrl: './buscar-usuario.component.html',
  styleUrls: ['./buscar-usuario.component.css']
})

export class BuscarUsuarioComponent extends DatatableBase<UsuarioListado> implements OnInit, AfterViewInit {

  public _userDataSource: UsuarioListadoDataSource;
  public displayedColumns: string[] = ['id', 'username', 'nombreCompleto', 'email', 'event'];

  public initialSize : number = 10;

  @ViewChild('inputCriteria') input: ElementRef;

  constructor(
    private _serviceUser: ServiceUser,
    public _modalService: NgbModal,
    public modal: NgbActiveModal) {
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

  loadUsuarioListadoPage() {
    this._userDataSource
      .loadUsuarioListado(
        this.input.nativeElement.value,
        this.paginator.pageIndex,
        this.paginator.pageSize);
  }

}
