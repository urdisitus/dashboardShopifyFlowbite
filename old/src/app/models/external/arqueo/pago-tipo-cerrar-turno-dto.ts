export interface IPagoTipoCerrarTurnoDto {
    id?: number;
    descripcion?: string;
    xStoreTenderId?: string;
    keySin?: number;
    generaVoucher?: boolean;
    moneda?: string;
    montoSistema?: number;
    monto?: number;
    tipoCambio?: number;
}