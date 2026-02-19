
export interface DataTableColumn {
    data?: string;
    name?: string;
    orderable?: boolean;
    searchable?: boolean;
    search?: Search;
}

export interface DataOrder {
    column?: number;
    name?: number;
    dir?: string;
}

export interface Search {
    regex?: boolean;
    value?: string;
}

export interface DataTableParam<T> {
    param?: T;
    columns?: DataTableColumn[];
    draw?: number;
    length?: number;
    order?: DataOrder[];
    search?: Search;
    start?: number;
}