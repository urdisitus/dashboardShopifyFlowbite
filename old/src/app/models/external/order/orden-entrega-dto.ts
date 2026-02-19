export interface OrdenEntregaDto {
    id?: number;
    entregaProvider?: string;
    entregaOrdenId?: string;
    trackingLink?: string;
    agenteEntregaId?: string;
    agenteEntregaNombre?: string;
    agenteEntregaFoto?: string;
    agenteEntregaTelefono?: string;
    fechaLlegada?: Date;
    fechaInicioEntrega?: Date;
    fechaFinalizacion?: Date;
    estado?: string;
    estadoExterno?: string;
    fechaCreacion?: Date;
    fechaModificacion?: Date;
}