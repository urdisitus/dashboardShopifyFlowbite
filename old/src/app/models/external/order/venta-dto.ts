export interface IVentaAnulacionDto {
    id?: number;
    motivoId?: number;
    motivo?: string;
    otroMotivo?: string;
    usuario?: string;
    usuarioId?: string;
    fecha?: Date;
}

export interface IVentaSeguroDto {
    ventaId?: number;
    empresaId?: string;
    empresaNombre?: string;
    aseguradoId?: string;
    aseguradoNombre?: string;
    polizaId?: string;
    medicoId?: number;
    medicoNombre?: string;
    patologiaId?: number;
    nroReceta?: string;
    montoCobertura?: number;
    porcentajeCobertura?: number;
    codigoBarraAsegurado?: string;
    tipoCobertura?: string;
}

export interface IDocumentoFiscalCreDeDto {
    clienteAdjuntoOriginalPrimerNombre?: string;
    clienteAdjuntoOriginalSegundoNombre?: string;
    ventaId?: number;
    transaccionOriginalId?: string;
    sucursalOriginalId?: number;
    puntoVentaOriginalId?: number;
    cajaOriginalId?: number;
    numeroFacturaOriginal?: number;
    fechaEmisionFacturaOriginal?: Date;
    montoTotalOriginal?: number;
    creDeNumeroNota?: number;
    cufOriginal?: string;
    cufdOriginal?: string;
    cuisOriginal?: string;
    numeroAutorizacionOriginal?: number;
    codigoControlOriginal?: string;
    llaveDosificacionOriginal?: string;
}

export interface IDocumentoFiscalDto {
    ventaId?: number;
    numeroFactura?: number;
    fechaEmision?: Date;
    codigoControl?: string;
    llaveDosificacion?: string;
    numeroAutorizacion?: number;
    fechaLimiteEmision?: Date;
    tipoDocumentoIdentidadId?: number;
    documentoIdentidad?: string;
    complementoDocIdentidad?: string;
    primerNombreCliente?: string;
    segundoNombreCliente?: string;
    tipoDocumentoFiscalId?: number;
    tipoActividadEconomicaId?: number;
    cuf?: string;
    cufd?: string;
    cuis?: string;
    leyendaEmpresa?: string;
    direccionEmpresa?: string;
    telefonoEmpresa?: string;
    tituloDocumentoFiscal?: string;
    nitEmisor?: number;
    qrLeyend?: string;
    qrBuffer?: string;
    leyendaActividadEconomica?: string;
    branchOfficeLeyendCode?: string;
    fiscalDocumentLeyend?: string;
    leyendaFactura?: string;
    leyendaEstadoFactura?: string;
    estado?: number;
}

export interface ICampanaComprobanteGeneralDto {
    id?: number;
    total?: number;
    estado?: number;
    fechaCreacion?: Date;
    campanaId?: number;
    ventaId?: number;
    comprobantesDetalle?: ICampanaComprobanteDetalleDto[];
}

export interface ICampanaComprobanteDetalleDto {
    id?: number;
    campaniaComprobanteGeneralId?: number;
    valorCriterio?: number;
    total?: number;
    estado?: number;
    campanaCriterioId?: number;
    campanaCriterioDescripcion?: string;
}

export interface IVentaDetalleDto {
    id?: number;
    ventaId?: number;
    lineaId?: number;
    productoActividadEconomicaId?: number;
    unidadMedidaSin?: number;
    productoIdSin?: string;
    productoId?: string;
    productoDescripcion?: string;
    productoUnidadMedida?: string;
    productoPrecioUnitario?: number;
    cantidad?: number;
    montoSubtotal?: string;
    descuentoPorcentajeTotal?: string;
    montoTotalDescuento?: string;
    montoTotal?: string;
    montoImpuesto?: string;
    modalidadCampaniaId?: string;
    modalidadCampaniaValor?: number;
    devolucionLineaId?: number;
    codigoRazonDevolucionId?: string;
    codigoRazonDevolucionObservacion?: string;
    comentario?: string;
    tipoDetalleTransaccion?: number;
    porcentajeCoberturaSeguro?: number;
    montoCoberturaSeguro?: number;
    infoExtra?: string;
    ventaLineaDescuento?: IVentaDescuentoDto[];
}

export interface IVentaDescuentoDto {
    id?: number;
    ventaId?: number;
    descuentoId?: string;
    tipo?: string;
    descripcion?: string;
    porcentaje?: number;
    monto?: number;
    idUsuarioAutorizador?: string;
    usuarioAutorizador?: string;
}

export interface IVentaPagoDto {
    id?: number;
    ventaId?: number;
    tipoPagoId?: string;
    tipoPagoNombre?: string;
    monto?: number;
    clubId?: string;
    numeroTarjeta?: string;
    codigoCliente?: string;
    fechaConsultaPago?: Date;
    codigoConfirmacion?: string;
    codigoBanco?: string;
    descripcionBanco?: string;
}

export interface IVentaDto {
    id?: number;
    observacion?: string;
    ventaOriginalId?: number;
    codigoUnicoVentaOriginal?: string;
    codigoUnico?: string;
    hash?: string;
    noCia?: string;
    centroDitribucion?: string;
    periodo?: number;
    transaccionId?: string;
    cajaId?: number;
    sucursalId?: number;
    puntoVentaId?: number;
    sucursalSinId?: number;
    erpFarmacorpId?: string;
    erpClienteId?: string;
    erpGrupoId?: string;
    clienteId?: string;
    clientePartyId?: string;
    clienteLoyaltyId?: string;
    tipoDocumentoIdentidadId?: number;
    documentoIdentidad?: string;
    complementoDocIdentidad?: string;
    clienteAdjuntoTipoDocumentoIdentidad?: string;
    clienteAdjuntoDocumentoIdentidad?: string;
    clienteAdjuntoPrimerNombre?: string;
    clienteAdjuntoSegundoNombre?: string;
    primerNombreCliente?: string;
    segundoNombreCliente?: string;
    clienteCorreo?: string;
    clienteCelular?: string;
    tipoActividadEconomicaId?: number;
    tipoDocumentoFiscalId?: number;
    fechaEmision?: Date;
    descuentoPorcentaje?: number;
    descuento?: number;
    subTotal?: number;
    montoTotal?: number;
    montoDonacion?: number;
    cambioEfectivo?: number;
    montoImpuesto?: number;
    montoTotalConImpuesto?: number;
    tipoEmisionId?: number;
    cajeroId?: string;
    usuarioCajero?: string;
    documentoOwnerSalesForce?: string;
    documentoSectorId?: number;
    turnoId?: string;
    fechaContingencia?: Date;
    keyOrigen?: string;
    keyBodega?: string;
    infoExtra?: string;
    tipoFacturacionId?: number;
    facturaAImprimir?: Boolean;
    estado?: number;
    fechaAnulacion?: Date;
    tipoMotivoAnulacionId?: number;
    noPasarVenta?: Boolean;
    generarFactura?: Boolean;
    postVoidSale?: Boolean;
    psicotropicoRecetaNumero?: string;
    psicotropicoMedicoNombre?: string;
    psicotropicoPacienteNombre?: string;
    houseAccountTitularPrimerNombre?: string;
    houseAccountTitularSegundoNombre?: string;
    houseAccountDependientePrimerNombre?: string;
    houseAccountDependienteSegundoNombre?: string;
    ventaAnulacion?: IVentaAnulacionDto;
    ventaSeguro?: IVentaSeguroDto;
    documentoFiscalCreDe?: IDocumentoFiscalCreDeDto;
    documentoFiscal?: IDocumentoFiscalDto;
    campanaComprobanteGeneral?: ICampanaComprobanteGeneralDto;
    ventaDetalle?: IVentaDetalleDto[];
    ventaDescuento?: IVentaDescuentoDto[];
    ventaPago?: IVentaPagoDto[];
}