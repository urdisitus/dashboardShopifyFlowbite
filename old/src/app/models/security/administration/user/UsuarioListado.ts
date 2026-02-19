export interface UsuarioListado {
    id?: number;
    nombres?: string;
    apellidos?: string;
    nombreCompleto?: string;
    email?: string;
    username?: string;
    telefono?: string;
    celular?: string;
    tipoDocumentoIdentidadId?: number;
    documentoIdentidad?: string;
    estado?: number;
    roles?: string[];
    noCia?: string;
    keyBodega?: string;
    puntoVentaId?: number;
    fechaCreacion?: Date;
    fechaEdicion?: Date;
}