import { NgxMatDatetimePickerModule, NgxMatTimepickerModule } from '@angular-material-components/datetime-picker';
import { NgxMatMomentModule } from '@angular-material-components/moment-adapter';
import { MarkAsDeliveredComponent } from './components/external/orders/mark-as-delivered/mark-as-delivered.component';
import { RemoteStringStoreComponent } from './components/remote-string/remote-string-store/remote-string-store.component';
import { RemoteStringListComponent } from './components/remote-string/remote-string-list/remote-string-list.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BlockUIModule } from 'ng-block-ui';
import { NgSelect2Module } from 'ng-select2';

// Layout Modules
import { CommonLayoutComponent } from './common/common-layout.component';
import { AuthenticationLayoutComponent } from './common/authentication-layout.component';

// Directives
import { NgbModule, NgbModalConfig, NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Sidebar_Directives } from './shared/directives/side-nav.directive';
import { Cards_Directives } from './shared/directives/cards.directive';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

// Routing Module
import { AppRoutes } from './app.routing';

// App Component
import { AppComponent } from './app.component';
import { DashboardMenuComponent } from './components/security/menu/dashboard-menu/dashboard-menu.component';
import { DashboardMenuItemComponent } from './components/security/menu/dashboard-menu-item/dashboard-menu-item.component';
import { AngularWebStorageModule } from 'angular-web-storage';
import { LoginComponent } from './components/security/login/login.component';
import { DataTablesModule } from 'angular-datatables';
import { FormModalComponent } from './components/generic/crud/form-modal/form-modal.component';
import { SelectorSearchableComponent } from './components/generic/selector-searchable/selector-searchable.component';
// toads
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { BuscarUsuarioComponent } from './components/core/usuarios/buscar-usuario/buscar-usuario.component';
import { ExecutingComponent } from './components/shared/executing/executing.component';

import { ExecutingService } from './services/shared/executing.service';
import { AppHttpInterceptor } from './services/core/http.interceptor';
import { ErrorService, NgbdModalConfirmAutofocus } from './services/shared/error.service';


// material
import { MatMomentDateModule, MomentDateAdapter } from "@angular/material-moment-adapter";
import { MatCheckboxModule, MatNativeDateModule } from '@angular/material';
import { MatButtonModule } from '@angular/material';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule, MatPaginatorIntl } from '@angular/material/paginator';
import { MAT_DATE_LOCALE } from '@angular/material';
import { TableModalConfirmacion } from './components/generic/component/datatable.base';
import { AgmCoreModule } from '@agm/core';
// Pages Sucurusal
import { HomeComponent } from './pages/sucursal/home/home.component';
// Pipes
import { NodataPipe } from './pipes/nodata.pipe';
import { DownloadLinkPipe } from './pipes/download-link.pipe';
import { DateFormatEsPipe } from './pipes/date-format-es.pipe';
import { ChangePasswordComponent } from './components/security/change_password/change_password.component';
import { PerfilComponent } from './components/security/perfil/perfil.component';
import { MatPaginatorIntlCro } from './components/generic/component/MatPaginatorIntlCro';
import { ResetpasswordComponent } from './components/security/administration/resetpassword/resetpassword.component';
import { OrderListComponent } from './components/external/orders/order-list/order-list.component';
import { UpdateNitNombreComponent } from './components/external/orders/update-nit-nombre/update-nit-nombre.component';
import { UpdateShippingAddressComponent } from './components/external/orders/update-shipping-address/update-shipping-address.component';
import { BuscarClientComponent } from './components/external/clients/buscar-client/buscar-client.component';
import { CreateClientComponent } from './components/external/clients/create-client/create-client.component';
import { UserListComponent } from './components/security/administration/users/user-list/user-list.component';
import { UserFormComponent } from './components/security/administration/users/user-form/user-form.component';
import { AddressListComponent } from './components/external/clients/address-list/address-list.component';
import { AddressFormComponent } from './components/external/clients/address-form/address-form.component';
import { CustomerListComponent } from './components/external/clients/customer-list/customer-list.component';
import { AutocompleteComponent } from './components/core/autocomplete/autocomplete.component';
import { ArqueoListComponent } from './components/external/arqueo/arqueo-list/arqueo-list.component';
import { InicioTurnoComponent } from './components/external/turno/inicio-turno/inicio-turno.component';
import { CerrarTurnoComponent } from './components/external/turno/cerrar-turno/cerrar-turno.component';
import { ArqueoRegenteComponent } from './components/external/arqueo/arqueo-regente/arqueo-regente.component';
import { ArqueoVoucherComponent } from './components/external/arqueo/arqueo-voucher/arqueo-voucher.component';
import { NewPreaperturaComponent } from './components/core/preaperturaarqueo/new/newpreapertura.component';
import { ReconteoComponent } from './components/core/preaperturaarqueo/reconteo/reconteo.component';
import { PreaperturaarqueoComponent } from './components/core/preaperturaarqueo/preaperturaarqueo.component';
import { CampanaArqueoComponent, NgbdModalConfirm } from './components/core/campanas/campana-arqueo/campana-arqueo.component';
import { CampanaAsignacionComponent } from './components/core/campanas/campana-asignacion/campana-asignacion.component';
import { PostVoidInvoiceComponent } from './components/external/orders/post-void-invoice/post-void-invoice.component';
import { ReportVentaAnulacionComponent } from './components/core/report/report-venta-anulacion/report-venta-anulacion.component';
import { SafePipe } from './services/external/safe.pipe';
import { ReportVentaSeguroComponent } from './components/core/report/report-venta-seguro/report-venta-seguro.component';
import { ReportVentaCreditoComponent } from './components/core/report/report-venta-credito/report-venta-credito.component';
import { ReportVentaArqueoComponent } from './components/core/report/report-venta-arqueo/report-venta-arqueo.component';
import { ReportVentaTendersComponent } from './components/core/report/report-venta-tenders/report-venta-tenders.component';
import { ReportVentaFarmaclubComponent } from './components/core/report/report-venta-farmaclub/report-venta-farmaclub.component';
import { ReportVentaDevolucionComponent } from './components/core/report/report-venta-devolucion/report-venta-devolucion.component';
import { ReportTiemposEntregaComponent } from './components/core/report/report-tiempos-entrega/report-tiempos-entrega.component';
import { ReportCantidadVentaComponent } from './components/core/report/report-cantidad-venta/report-cantidad-venta.component';
import { NotFoundComponent } from './components/shared/not-found/not-found.component';
import { TrackingComponent } from './components/external/orders/tracking/tracking.component';
import { ShoweventintComponent } from './components/external/monitor/showeventint/showeventint.component';
import { EventintComponent } from './components/external/monitor/eventint/eventint.component';
import { SegurosComponent } from './components/core/seguros/seguros.component';
import { ResetpasswordrequestComponent } from './components/security/resetpasswordrequest/resetpasswordrequest.component';
import { ResetpasswordtokenComponent } from './components/security/resetpasswordtoken/resetpasswordtoken.component';
import { WmseventintComponent } from './components/external/monitor/wmseventint/wmseventint.component';
import { NotificacionesComponent } from './components/Notification/notificaciones/notificaciones.component';
import { NotificationNewComponent } from './components/Notification/notification-new/notification-new.component';
import { HistoryNotificationComponent } from './components/Notification/history-notification/history-notification.component';
import { HistoryDetailComponent } from './components/Notification/history-detail/history-detail.component';
import { NgxEmojiPickerModule } from 'ngx-emoji-picker';
import { ItemMatchCodeListComponent } from './components/marketplaces/item_match_code_list/item_match_code_list.component';
import { ItemMatchCodeFormComponent } from './components/marketplaces/item_match_code_form/item_match_code_form.component';
import { MarketplaceSettingFormComponent } from './components/marketplaces/setting_form/marketplace_setting_form.component';
import { MarketplaceSettingListComponent } from './components/marketplaces/setting_list/marketplace_setting_list.component';
import { LoyaltyCampaignListComponent } from './components/core/loyalty-campaign/loyalty-campaign-list/loyalty-campaign-list.component';
import { LoyaltyCampaignFormComponent } from './components/core/loyalty-campaign/loyalty-campaign-form/loyalty-campaign-form.component';
import { RedeemPointFormComponent } from './components/core/redeem-point/redeem-point-form/redeem-point-form.component';
import { RedeemPointListComponent } from './components/core/redeem-point/redeem-point-list/redeem-point-list.component';
import { BranchOfficesComponent } from './components/branch-offices/branch-offices.component';
import { BarnchOfficeListComponent } from './components/branch-offices/barnch-office-list/barnch-office-list.component';
import { BranchOfficesEditComponent } from './components/branch-offices/branch-offices-edit/branch-offices-edit.component';
import { PoligonoComponent } from './components/branch-offices/poligono/poligono.component';
import { OrderComponent } from './components/order/order.component';
import { OrderViewComponent } from './components/order/order-view/order-view.component';
import { Order_ListComponent } from './components/order/order-list/order-list.component';
import { ShopifyOrderListComponent } from './components/order/shopify-order-list/shopify-order-list.component';


@NgModule({
  imports: [
    NgxEmojiPickerModule.forRoot(),
    BrowserModule,
    RouterModule.forRoot(AppRoutes, { useHash: true }),
    BlockUIModule.forRoot(),
    NgbModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    AngularWebStorageModule,
    PerfectScrollbarModule,
    HttpClientModule,
    DataTablesModule,
    NgSelect2Module,
    CommonModule,
    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot(), // ToastrModule added
    MatCheckboxModule,
    MatCheckboxModule,
    MatButtonModule,
    MatInputModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    NgxMatMomentModule,
    MatFormFieldModule,
    MatRadioModule,
    MatSelectModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatMenuModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatGridListModule,
    MatCardModule,
    MatStepperModule,
    MatTabsModule,
    MatExpansionModule,
    MatButtonToggleModule,
    MatChipsModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatDialogModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatNativeDateModule,
    MatMomentDateModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyALR4hP7YiRxeLjbjrnvEKvzGkJs001z68',
      libraries: ['places', 'geometry', 'drawing']
    })
  ],
  declarations: [    
    AppComponent,
    CommonLayoutComponent,
    AuthenticationLayoutComponent,
    Sidebar_Directives,
    Cards_Directives,
    DashboardMenuComponent,
    DashboardMenuItemComponent,
    LoginComponent,
    ChangePasswordComponent,
    FormModalComponent,
    SelectorSearchableComponent,
    BuscarUsuarioComponent,
    ExecutingComponent,
    TableModalConfirmacion,
    NgbdModalConfirmAutofocus,
    HomeComponent,
    NodataPipe,
    DownloadLinkPipe,
    DateFormatEsPipe,
    PerfilComponent,
    ResetpasswordComponent,
    OrderListComponent,
    UpdateNitNombreComponent,
    MarkAsDeliveredComponent,
    UpdateShippingAddressComponent,
    BuscarClientComponent,
    CreateClientComponent,
    UserListComponent,
    UserFormComponent,
    AddressFormComponent,
    AddressListComponent,
    CustomerListComponent,
    AutocompleteComponent,
    ArqueoListComponent,
    InicioTurnoComponent,
    CerrarTurnoComponent,
    ArqueoRegenteComponent,
    ArqueoVoucherComponent,
    NgbdModalConfirm,
    ReconteoComponent,
    NewPreaperturaComponent,
    PreaperturaarqueoComponent,
    CampanaArqueoComponent,
    CampanaAsignacionComponent,
    PostVoidInvoiceComponent,
    ReportVentaAnulacionComponent,
    SafePipe,
    ReportVentaSeguroComponent,
    ReportVentaCreditoComponent,
    ReportVentaArqueoComponent,
    ReportVentaTendersComponent,
    ReportVentaFarmaclubComponent,
    ReportVentaDevolucionComponent,
    ReportTiemposEntregaComponent,
    ReportCantidadVentaComponent,
    NotFoundComponent,
    TrackingComponent,
    EventintComponent,
    ShoweventintComponent,
    SegurosComponent,
    ResetpasswordrequestComponent,
    ResetpasswordtokenComponent,
    WmseventintComponent,
    RemoteStringListComponent,
    RemoteStringStoreComponent,
    NotificacionesComponent,
    NotificationNewComponent,
    HistoryNotificationComponent,
    HistoryDetailComponent,
    ItemMatchCodeListComponent,
    ItemMatchCodeFormComponent,
    MarketplaceSettingListComponent,
    MarketplaceSettingFormComponent,
    LoyaltyCampaignListComponent,
    LoyaltyCampaignFormComponent,
    RedeemPointFormComponent,
    RedeemPointListComponent,
    BranchOfficesComponent,
    BarnchOfficeListComponent,
    BranchOfficesEditComponent,
    PoligonoComponent,
    OrderComponent,
    Order_ListComponent,
    ShopifyOrderListComponent,
    OrderViewComponent
  ],
  exports: [],
  providers: [
    MatDatepickerModule,
    ExecutingService,
    ErrorService,
    NgbModalConfig,
    NgbModal,
    NgbActiveModal,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AppHttpInterceptor,
      multi: true
    },
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' },
    { provide: MatPaginatorIntl, useClass: MatPaginatorIntlCro }
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    TableModalConfirmacion,
    BuscarUsuarioComponent,
    NgbdModalConfirmAutofocus,
    UpdateNitNombreComponent,
    MarkAsDeliveredComponent,
    UpdateShippingAddressComponent,
    BuscarClientComponent,
    CreateClientComponent,
    UserFormComponent,
    UserListComponent,
    AddressFormComponent,
    AddressListComponent,
    CustomerListComponent,
    InicioTurnoComponent,
    CerrarTurnoComponent,
    ArqueoRegenteComponent,
    ArqueoVoucherComponent,
    NgbdModalConfirm,
    NewPreaperturaComponent,
    ReconteoComponent,
    CampanaAsignacionComponent,
    PostVoidInvoiceComponent,
    ShoweventintComponent,
    ResetpasswordrequestComponent,
    RemoteStringStoreComponent,
    NotificationNewComponent,
    HistoryNotificationComponent,
    ItemMatchCodeFormComponent,
    MarketplaceSettingFormComponent,
    LoyaltyCampaignFormComponent, 
    RedeemPointFormComponent,
    BranchOfficesEditComponent,
    PoligonoComponent,
    OrderViewComponent
  ]
})


export class AppModule { }
