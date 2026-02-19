import { Component, OnInit } from '@angular/core';
import { ApiOrderService } from '../../../services/order/order.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { SessionProvider } from '../../../providers/session/session.provider';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderDto } from '../../../dataTransferObjects/order/order';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { Utils } from '../../../providers/utils';

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
  selector: 'app-order-view',
  templateUrl: './order-view.component.html',
  styleUrls: ['./order-view.component.css'],
  preserveWhitespaces: true,
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class OrderViewComponent implements OnInit {
  id: number;
  data: OrderDto | null = null;

  constructor(private _apiService: ApiOrderService,
    public _modalService: NgbModal,
    private _toastr: ToastrService,
    public router: Router,
    private _sesionUser: SessionProvider,
    private route: ActivatedRoute,) {
    this.id = this.route.snapshot.params.id;
  }

  ngOnInit() {
    this.obtener();
  }

  obtener(): void {

    this._apiService.GetComplete(this.id)
      .then(
        (result) => {
          this.data = result;
        }
      );
  }
  getMainAttributes() {
    if (!this.data) return [];
    const { saleOrderDelivery, saleOrderDetail, saleOrderPayment, saleOrderDiscount, saleOrderDetailDiscount, ...mainAttributes } = this.data;
    return Object.entries(mainAttributes).map(([key, value]) => [key, value]);
  }

  getFormattedAmount(monto: number): string {
    if (monto) {
      return `Bs. ${monto}`;
    }
    return '';
  }
  private marcarEntregado(): void {

    Utils.confirm(
      `¿Esta seguro que desea marcar como entregado?`,
      () => {

        if (this.data.status == 4) //Facturado
          this._apiService.MarcarEntregado(this.data.id)
            .then(
              (result) => {
                if (result) {
                  this.obtener();
                  this._toastr.success('Se marco como entregada.', 'Orden', { progressAnimation: 'decreasing', timeOut: 3000 });
                }
              }
            );
      });
  }

  onMapReady(map) {
    this.initDrawingManager(map);

  }

  initDrawingManager(map: any) {

    const option = {
      drawingControl: true,
      drawingControlOptions: {
        drawingModes: [google.maps.drawing.OverlayType.POLYGON]
      },
      polygonOptions: {
        draggable: true,
        editable: true
      },
      drawingMode: google.maps.drawing.OverlayType.POLYGON
    };
    const drawingManager = new google.maps.drawing.DrawingManager(option);
    drawingManager.setMap(map);


    map.setOptions({
      fullscreenControl: true, 
      fullscreenControlOptions: {
        position: google.maps.ControlPosition.RIGHT_BOTTOM 
      }
    });


  }
}
