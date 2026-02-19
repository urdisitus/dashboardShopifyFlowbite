export interface GetTurnosParam {
    ids?: number[];
    states?: number[];
    branchOfficeIds?: string[];
    criteria?: string;
    pageIndex?: number;
    pageSize?: number;
    tieneArqueo?: boolean;
    startDate?:string;
    endDate?:string;
}