export interface IEventSearchGeneralParam {
  textoBusqueda?: string;
  idRegistro?: string;
  idShopifyBusiness?: string;
  createDateStartUtc?: string;
  createDateEndUtc?: string;
  keyTipo?: string;
  keyTipoEventCode?: string;
  keyEventStatus?: string;
  pageIndex?: number;
  pageSize?: number;
  isAsc?: boolean;
}

export interface IEventSearchGeneralFilterParam {
  textoBusqueda?: string;
  idRegistro?: string;
  idShopifyBusiness?: string;
  createDateStartUtc?: string;
  createDateEndUtc?: string;
  keyTipo?: string;
  keyTipoEventCode?: string;
  keyEventStatus?: string;
}


export interface IChangeEventStatusParam {
  keyEventStatus?: string;
  keyTipo?: string;
  idRegistro?: string;
}
