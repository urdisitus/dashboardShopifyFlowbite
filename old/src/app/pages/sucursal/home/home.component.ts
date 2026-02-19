import { Component, OnInit } from '@angular/core';
import { SessionProvider } from 'src/app/providers/session/session.provider';
import { ExecutingService } from 'src/app/services/shared/executing.service';
import { SessionService } from '../../../services/security/session/Impl/session.service';
import { ApiOrderService } from 'src/app/services/order/order.service';
import { IShopifyShopDtp } from 'src/app/dataTransferObjects/order/order';

interface HomeInfo {
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styles: []
})
export class HomeComponent implements OnInit {

  userInfo: IUserInfo = {};
  homeInfo: HomeInfo = {};
  shops: IShopifyShopDtp[] = [];

  constructor(
    public sessionProvider: SessionProvider,
    public executingService: ExecutingService,
    public apiOrderService: ApiOrderService
  ) {
  }

  ngOnInit() {
    this.sessionProvider.getUserInfo().then((userInfo: IUserInfo) => {
      this.userInfo = userInfo;
    });
    this.apiOrderService.GetShopifyShops().then((result: IShopifyShopDtp[]) => {
      this.shops = result;
    });
  }
}
