export interface MarkAsDeliveredParam {
  orderId?: number;
  orderName?: string;
  customerId?: number;
  fechaInicioEntrega?: Date;
  fechaLlegada?: Date;
  fechaFinalizacion?: Date;
  agenteEntregaNombre?: string;
}
