export interface ListarVentaSeguroParam {
  starDate: Date;
  endDate: Date;
}

export interface ListarVentaSeguroResult {
  fecha: Date;
  codVendedor: number;
  vendedor: string;
  caja: number;
  nroTicket: string;
  nroFactura: number;
  cliente: string;
  montoCobertura: number;
  montoGeneral: number;
  bodega: string;
  origen: string;
  ventaId: number;
  puntoVenta: number;
  noCia: string;
  codigoUnico: string;
  urlReceta?: string;
  aseguradora: string;
}
