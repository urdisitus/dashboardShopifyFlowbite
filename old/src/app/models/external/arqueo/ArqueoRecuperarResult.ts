export interface ArqueoDetalleDto {
  arqueoId: number;
  tipoPagoId: number;
  monto: number;
  montoSistema: number;
  montoBs: number;
  tipoCambio: number;
  id: number;
  montoRegente?:number;
  montoRegenteBs?:number;
  fechaModificacion?:Date;
  usuarioModificacion?:string;
}

export interface ArqueoDto {
  turnoId?: number;
  codigo?: string;
  fecha?: Date;
  observacion?: string;
  usuarioId?: number;
  usuario?: string;
  montoTotalSistema?: number;
  montoTotal?: number;
  montoTotalBs?: number;
  fechaCreacion?: Date;
  fechaModificacion?: Date;
  arqueoDetalle?: ArqueoDetalleDto[];
  id?: number;
  tipoCambioSus?:number;
  regenteId?:number;
  regente?:string;
  regenteMontoTotal?:number;
  regenteMontoTotalBs?:number;
}

export interface TurnoDto {
  codigo?: string;
  noCia?: string;
  keyBodega?: string;
  idSucursal?:number;
  fecha?: Date;
  puntoVentaId?: number;
  keyOrigen?: string;
  hash?: string;
  montoApertura?: number;
  usuarioId?: number;
  usuario?: string;
  observacionApertura?: string;
  cajaId?: number;
  fechaCierre?: Date;
  montoCierre?: number;
  observacionCierre?: string;
  estado?: number;
  tieneArqueo?: boolean;
  fechaCreacion?: Date;
  fechaModificacion?: Date;
  eventoIntegracionLastDate?: Date;
  eventoIntegracionCount?: number;
  arqueo?: ArqueoDto[];
  id?: number;
}
