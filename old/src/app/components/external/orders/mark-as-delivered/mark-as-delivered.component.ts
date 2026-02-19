import { MarkAsDeliveredOrder } from './../../../../services/external/order/mark-as-delivered.service';
import { MarkAsDeliveredParam } from './../../../../models/external/order/mark-as-delivered-param';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { OrderListItemDto } from 'src/app/models/external/order/order-list-item-dto';

@Component({
  selector: 'app-mark-as-delivered',
  templateUrl: './mark-as-delivered.component.html',
  styleUrls: ['./mark-as-delivered.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class MarkAsDeliveredComponent implements OnInit {

  param: MarkAsDeliveredParam = {};
  order: OrderListItemDto = {};
  minDate: Date;
  maxDate: Date;

  constructor(
    public service: MarkAsDeliveredOrder,
    public modal: NgbActiveModal
  ) {

  }

  ngOnInit() {
  }

  dismissModal() {
    this.modal.dismiss('cancel click');
  }

  setOrder(order: OrderListItemDto) {
    this.order = order;
    this.param.orderId = order.id;
    this.param.customerId = order.customerId;
    this.param.orderName = order.name.replace('#', '');
    if (order.ordenEntrega) {
      this.param.fechaFinalizacion = order.ordenEntrega.fechaFinalizacion;
      this.param.fechaInicioEntrega = order.ordenEntrega.fechaInicioEntrega;
      this.param.fechaLlegada = order.ordenEntrega.fechaLlegada;
      this.param.agenteEntregaNombre = order.ordenEntrega.agenteEntregaNombre;
    }
    this.minDate = new Date(order.processedAtStr);
    this.maxDate = new Date();
  }

  guardar() {
    this.service.update(this.param).then((result: OrderListItemDto) => {
      this.modal.close(result);
      this.dismissModal();
    });
  }
}
