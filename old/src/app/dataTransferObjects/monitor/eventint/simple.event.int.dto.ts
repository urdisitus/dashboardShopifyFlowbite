export interface ISimpleEventIntDto{
    keySource?: string;
    keyBodega?: string;
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
    id?: number;
    dFechaCreacion?: Date;
    dFechaUltimoEnvio?: Date;
    bSelected?: boolean;
}