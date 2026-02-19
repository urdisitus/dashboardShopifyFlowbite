import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Layouts
import { CommonLayoutComponent } from './common/common-layout.component';
import { LoginComponent } from './components/security/login/login.component';

// Pages Sucursal
import { HomeComponent } from './pages/sucursal/home/home.component';
import { PerfilComponent } from './components/security/perfil/perfil.component';
import { ResetpasswordComponent } from './components/security/administration/resetpassword/resetpassword.component';
import { OrderListComponent } from './components/external/orders/order-list/order-list.component';
import { UserListComponent } from './components/security/administration/users/user-list/user-list.component';
import { ArqueoListComponent } from './components/external/arqueo/arqueo-list/arqueo-list.component';
import { PreaperturaarqueoComponent } from './components/core/preaperturaarqueo/preaperturaarqueo.component';
import { CampanaArqueoComponent } from './components/core/campanas/campana-arqueo/campana-arqueo.component';
import { ReportVentaAnulacionComponent } from './components/core/report/report-venta-anulacion/report-venta-anulacion.component';
import { ReportVentaDevolucionComponent } from './components/core/report/report-venta-devolucion/report-venta-devolucion.component';
import { ReportVentaCreditoComponent } from './components/core/report/report-venta-credito/report-venta-credito.component';
import { ReportVentaTendersComponent } from './components/core/report/report-venta-tenders/report-venta-tenders.component';
import { ReportVentaFarmaclubComponent } from './components/core/report/report-venta-farmaclub/report-venta-farmaclub.component';
import { ReportVentaArqueoComponent } from './components/core/report/report-venta-arqueo/report-venta-arqueo.component';
import { ReportVentaSeguroComponent } from './components/core/report/report-venta-seguro/report-venta-seguro.component';
import { ReportTiemposEntregaComponent } from './components/core/report/report-tiempos-entrega/report-tiempos-entrega.component';
import { ReportCantidadVentaComponent } from './components/core/report/report-cantidad-venta/report-cantidad-venta.component';
import { TrackingComponent } from './components/external/orders/tracking/tracking.component';
import { NotFoundComponent } from './components/shared/not-found/not-found.component';
import { EventintComponent } from './components/external/monitor/eventint/eventint.component';
import { SegurosComponent } from './components/core/seguros/seguros.component';
import { ResetpasswordtokenComponent } from './components/security/resetpasswordtoken/resetpasswordtoken.component';
import { WmseventintComponent } from './components/external/monitor/wmseventint/wmseventint.component';
import { RemoteStringListComponent } from './components/remote-string/remote-string-list/remote-string-list.component';
import { NotificacionesComponent } from './components/Notification/notificaciones/notificaciones.component';
import { HistoryNotificationComponent } from './components/Notification/history-notification/history-notification.component';
import { HistoryDetailComponent } from './components/Notification/history-detail/history-detail.component';
import { ItemMatchCodeListComponent } from './components/marketplaces/item_match_code_list/item_match_code_list.component';
import { MarketplaceSettingListComponent } from './components/marketplaces/setting_list/marketplace_setting_list.component';
import { LoyaltyCampaignListComponent } from './components/core/loyalty-campaign/loyalty-campaign-list/loyalty-campaign-list.component';
import { RedeemPointListComponent } from './components/core/redeem-point/redeem-point-list/redeem-point-list.component';
import { BranchOfficeAddComponent } from './modules/sfe/pages/branch-office/add/add.component';
import { BranchOfficesComponent } from './components/branch-offices/branch-offices.component';
import { OrderComponent } from './components/order/order.component';
import { OrderViewComponent } from './components/order/order-view/order-view.component';


export const AppRoutes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'order/tracking/:orderId',
    component: TrackingComponent
  },
  {
    path: 'login',
    component: LoginComponent,
    data: {
      title: 'Inicio de sesión'
    },
    pathMatch: 'full',
  },
  {
    path: 'resetpassword/:token',
    component: ResetpasswordtokenComponent,
    data: {
      title: 'Restaurar Contraseña'
    },
    pathMatch: 'full',
  },
  {
    path: '',
    component: CommonLayoutComponent,
    children: [
      {
        path: 'dashboard',
        loadChildren: './dashboard/dashboard.module#DashboardModule'
      },
      {
        path: 'sec/adm/resetpassword',
        component: ResetpasswordComponent
      },
      {
        path: 'sec/adm/user',
        component: UserListComponent
      },
      {
        path: 'home',
        component: HomeComponent
      },
      {
        path: 'perfil',
        component: PerfilComponent
      },
      {
        path: 'orders',
        component: OrderListComponent
      },
      {
        path: 'arqueo',
        component: ArqueoListComponent
      },
      {
        path: 'core/campania/preapertura',
        component: PreaperturaarqueoComponent
      },
      {
        path: 'core/campania/arqueo',
        component: CampanaArqueoComponent
      },
      {
        path: 'core/report/anulacion',
        component: ReportVentaAnulacionComponent
      },
      {
        path: 'core/report/credito',
        component: ReportVentaCreditoComponent
      },
      {
        path: 'core/report/devolucion',
        component: ReportVentaDevolucionComponent
      },
      {
        path: 'core/report/tenders',
        component: ReportVentaTendersComponent
      },
      {
        path: 'core/report/farmaclub',
        component: ReportVentaFarmaclubComponent
      },
      {
        path: 'core/report/arqueo',
        component: ReportVentaArqueoComponent
      },
      {
        path: 'core/report/seguro',
        component: ReportVentaSeguroComponent
      },
      {
        path: 'core/report/delivery',
        component: ReportTiemposEntregaComponent
      },
      {
        path: 'core/report/quantity',
        component: ReportCantidadVentaComponent
      },
      {
        path: 'monitor/eventint',
        component: EventintComponent
      },
      {
        path: 'monitor/wmseventint',
        component: WmseventintComponent
      },
      {
        path: 'core/remotestring',
        component: RemoteStringListComponent
      },
      {
        path: 'core/pagos/seguro',
        component: SegurosComponent
      },
      {
        path: 'sfe',
        loadChildren: './modules/sfe/sfe.module#SfeModule'
      },
      {
        path: 'notification',
        component: NotificacionesComponent
      },
      {
        path: 'notification/history/:campaign',
        component: HistoryNotificationComponent
      },
      {
        path: 'notification/history/detail/:campaign/:id',
        component: HistoryDetailComponent
      },
      {
        path: 'marketplaces/item_match_code',
        component: ItemMatchCodeListComponent
      },
      {
        path: 'marketplaces/setting',
        component: MarketplaceSettingListComponent
      },
      {
        path: 'core/loyalty_campaign',
        component: LoyaltyCampaignListComponent
      },
      {
        path: 'core/redeem_point',
        component: RedeemPointListComponent
      }, 
      {
        path: 'branch_offices',
        component: BranchOfficesComponent
      },
      {
        path: 'orders_list',
        component: OrderComponent
      },
      {
        path: 'orders_details/:id',
        component: OrderViewComponent
      }
    ]
  },
  {
    path: '404/:message',
    component: NotFoundComponent
  },
  {
    path: '404',
    component: NotFoundComponent
  },
  {
    path: '**',
    redirectTo: '/404'
  }
];

