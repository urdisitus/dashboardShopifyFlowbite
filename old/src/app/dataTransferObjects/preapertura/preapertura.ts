export interface GetCampanaModalidadCanjeResult {
  id: string;
  descripcion: string;
  estado: number;
  valor: number;
  campanaId: number;
}

export class CampanaResult {
  id: number;
  alias: string;
  nombre: string;
  descripcion: string;
  fechaInicio: Date;
  fechaFin: Date;
  estado: number;
  cantImpreVoucher: number;
}

export class GetCampanaParam {
  fecha: string;
}

export interface GetCampanaModalidadCanjeParam {
  fecha: string;
  campanaId: number;
}


export class PreaperturaResult {
  id: number;
  campanaId: number;
  turnoId: string;
  cajaId: string;
  fecha: Date;
  cantApertura: number;
  cantAsignado: number;
  cantCierreCajero: number;
  cantCierreRegente: number;
  cantSistema: number;
  cajeroUsuario: string;
  regenteUsuario: string;
  estado: number;
  keyBodega?:string;
  keyPuntoVenta?:string;
  campanaArqueoStickerDetalle: Array<PreaperturaCartillaResult>;
}

export class PreaperturaNuevaResult {
  preaperturaId: number;
}


export class NuevoParam {
  fecha: string;
  cantApertura: number;
  cantAsingado: number;
  cajeroUsuario: string;
  regenteUsuario: string;
  campanaId: number;
  keySource?: string;
}

export interface ConteoParam {
  preaperturaId: number;
  cantidad: number;
  canjes: Canje[];
  keySource?: string;
  keyBodega?: string;
  keyPuntoVenta?:string;
}

export interface Canje {
  id: string;
  cantidad: number;
}

export interface ListarParam {
  fecha: string;
  campanaId: number;
}

export interface PreaperturaCartillaResult {
  id: number;
  canjeModalidadId: string;
  descripcion: string;
  cantCartillasCierreCajero: number;
  cantCartillasCierreRegente: number;
  cantCartillasSistema: number;
}
