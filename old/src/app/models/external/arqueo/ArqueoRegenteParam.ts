import { IArqueoRegenteDetalleParam } from "./ArqueoRegenteDetalleParam";

export interface IArqueoRegenteParam {
    arqueoId?: number;
    observacionRegente?: string;
    regente?: string;
    regenteId?: number;
    arqueoDetalle?: IArqueoRegenteDetalleParam[];
}