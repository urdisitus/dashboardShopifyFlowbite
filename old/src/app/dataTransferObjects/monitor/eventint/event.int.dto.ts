export interface IEventIntDto {
    keySource?: string;
    fechaCreacion?: string;
    codigoUnico?: string;
    contadorEnvios?: number;
    fechaUltimoEnvio?: string;
    codigoUltimoError?: string;
    mensajeUltimoError?: string;
    tipoEventoIntegracionId?: number;
    tipoEventoIntegracion?: string;
    estado?: number;
    estadoDesc?: string;
    dato?: any;
    gZipData?: string;
    id?: number;
    dFechaCreacion?: Date;
    dFechaUltimoEnvio?: Date;
}