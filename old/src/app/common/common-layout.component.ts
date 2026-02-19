import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import swal, { SweetAlertResult } from 'sweetalert2';
import { SessionProvider } from '../providers/session/session.provider';
import { ChangePasswordComponent } from '../components/security/change_password/change_password.component';
import { InicioTurnoComponent } from '../components/external/turno/inicio-turno/inicio-turno.component';
import { ServiceTurno } from '../services/external/arqueo/turno.service';
import { TurnoDto } from '../models/external/arqueo/ArqueoRecuperarResult';
import { DatePipe } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CerrarTurnoComponent } from '../components/external/turno/cerrar-turno/cerrar-turno.component';
import { CommunicationService } from '../services/core/CommunicationService ';
import { environment } from 'src/environments/environment';
import { ServiceInoviceSFE } from '../services/external/order/invoice.sfe.service';
import { Utils } from '../providers/utils';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-dashboard',
    templateUrl: './common-layout.component.html',
    providers: [DatePipe, CommunicationService]
})

export class CommonLayoutComponent implements OnInit {
    @ViewChild('formChangePassword') public modal: ChangePasswordComponent;
    public app: any;
    public headerThemes: any;
    public sidenavThemes: any;
    public headerSelected: any;
    public sidenavSelected: any;
    public searchActived: any;
    public searchModel: any;
    public userInfo: IUserInfo;
    public turno: TurnoDto;
    public loadingTurno: boolean = false;
    public menu: IDashboardMenu[] = [];

    constructor(
        private communicationService: CommunicationService,
        public datepipe: DatePipe,
        public serviceTurno: ServiceTurno,
        public serviceInoviceSFE: ServiceInoviceSFE,
        public router: Router,
        private _toastr: ToastrService,
        public session: SessionProvider,
        public modalService: NgbModal) {
        this.app = {
            layout: {
                sidePanelOpen: false,
                isMenuOpened: false,
                isMenuCollapsed: true,
                themeConfigOpen: false,
                rtlActived: false,
                searchActived: false
            }
        };
        communicationService.changeEmitted$.subscribe(data => {
            this.loadUser();
        });
        this.headerThemes = ['header-default', 'header-primary', 'header-info', 'header-success', 'header-danger', 'header-dark'];
        this.sidenavThemes = ['sidenav-default', 'side-nav-dark'];

        this.loadUser();
    }

    loadUser() {
        this.session.getUserInfo().then((userInfo: IUserInfo) => {
            this.userInfo = userInfo;
            if (this.userInfo) {
                this.menu = this.userInfo.menu;
                this.obtenerTurno();
            } else {
                this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
            }
        });
    }

    public openChangePassword(): void {
        this.modal.open();
    }

    public closeSession(): void {
        swal({
            title: 'Confirmación',
            text: '¿Esta seguro que desea cerrar sesión?',
            type: 'question',
            showCancelButton: true,
            confirmButtonColor: '#26FF52',
            confirmButtonText: 'Cerrar Sesión',
            cancelButtonColor: '#CCCCCC',
            cancelButtonText: 'No'
        }).then((result: SweetAlertResult) => {
            if (result.value) {
                this.session.closeSession().then((result: boolean) => {
                    if (result) {
                        this.router.navigate(['/login']);
                    }
                });
            }
        });
    }

    onMenuCollapse() {
        this.app.layout.isMenuCollapsed = !this.app.layout.isMenuCollapsed;
        // this.session.setMenuState(this.app.layout.isMenuCollapsed);
    }

    onReloadClick() {
        this.serviceInoviceSFE.reloadInfo().then((result: boolean)=>{
            this._toastr.success('Se recargó el cache de shopify de manera exitosa!', 'Ajustes', { progressAnimation: 'decreasing', timeOut: 3000 });
        });
    }

    changeSidenav(sidenavTheme) {
        this.sidenavSelected = sidenavTheme;
        // this.session.setMenuColor(sidenavTheme);
    }

    changeHeader(headerTheme) {
        this.headerSelected = headerTheme;
        // this.session.setTheme(headerTheme);
    }

    changeRtl() {
        this.app.layout.rtlActived = !this.app.layout.rtlActived;
        // this.session.setRtl(this.app.layout.rtlActived);
    }

    public ngOnInit(): void {
        if (environment.production) {
            if (location.protocol === 'http:') {
                //window.location.href = location.href.replace('http', 'https');
            }
        }
    }

    iniciarTurno() {
        var newModal = this.modalService.open(InicioTurnoComponent, {
            windowClass: 'animated slideInUp',
            size: 'sm'
        });
        newModal.result.then((result: TurnoDto) => {
            this.turno = result;
        });
        return newModal;
    }

    cerrarTurno() {
        var newModal = this.modalService.open(CerrarTurnoComponent, {
            windowClass: 'animated slideInUp'
        });
        newModal.result.then((result: TurnoDto) => {
            this.obtenerTurno();
        });
        return newModal;
    }

    obtenerTurno() {
        if (this.userInfo && this.userInfo.keyBodega) {
            this.loadingTurno = true;
            this.serviceTurno.devolver().then((turno: TurnoDto) => {
                this.loadingTurno = false;
                this.turno = turno;
            }).catch(() => {
                this.loadingTurno = false;
            });
        } else {
            this.turno = null;
        }
    }

    turnoDesc() {
        if (this.turno && this.turno.fecha) {
            const fecha = new Date(this.turno.fecha.toString());
            return `Turno iniciado ${this.datepipe.transform(fecha, 'dd/MM/yyyy')}`;
        }
        return '';
    }
}
