export interface InvoiceOrderDto {
    noCia?: string;
    keyBodega?: string;
    puntoVentaId?: number;
    transactionId?: string;
    cajaId?:number;
    ventaId?:number;
    fechaEmision?: Date;
    invoiceWebUrl?: string;
    idOrden?: string;
    estado?: number;
    saved?: boolean;
    generated?: boolean;
    sended?: boolean;
}