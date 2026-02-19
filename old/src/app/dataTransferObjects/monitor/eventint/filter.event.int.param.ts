export interface IFilterEventIntParam {
    ids?: number[];
    startDate?: string;
    endDate?: string;
    states?: string[];
    types?: string[];
    branchOfficeIds?: string[];
    criteria?: string;
}

export interface IPaginationParam<T> {
    pageIndex?: number;
    pageSize?: number;
    param?: T;
}