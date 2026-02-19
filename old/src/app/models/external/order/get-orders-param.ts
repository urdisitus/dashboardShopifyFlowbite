export interface GetOrdersParam {
    keyBodega?: string;
    usuarioId?: number;
    isAdmin?: boolean;
    name?: string;
    limit?: string;
    pageInfo?: string;
    status?: string;
    financialStatus?: string;
    fulfillmentStatus?: string;
    processedAtMin?: string;
    processedAtMax?: string;
    loadMore?: boolean,
    invoiceDataEmpty?: boolean;
    shippingAddressEmpty?: boolean;
    salesUser?:string;
}
