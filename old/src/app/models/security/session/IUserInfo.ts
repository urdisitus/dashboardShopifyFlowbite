interface IUserInfo {
    userId? : number;
    userName? : string;
    firstName? : string;
    lastName? : string;
    completeName?: string;
    email?: string;
    phone?: string;
    cellPhone?: string;
    primerInicia?:boolean;
    tipoDocumentoIdentidadId?: number;
    documentoIdentidad?: string;
    state?:number;
    homeRoute?: string;
    noCia?: string;
    keyBodega?: string;
    puntoVentaId?: number;
    roles?:string[];
    menu? : IDashboardMenu[];
    privilegio?: IPrivilegioDto[];
}

interface IPrivilegioDto {
    id?: number;
    rolId?: number;
    aplicacionId?: number;
    objetoAuthId?: string;
    objetoAuthPadreId?: string;
    operacionId?: string;
}