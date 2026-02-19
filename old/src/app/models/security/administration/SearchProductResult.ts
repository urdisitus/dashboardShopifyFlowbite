import { Product } from "./Product";

export class SearchProductResult {
    elements: Product[];
    pageIndex: number;
    pageSize: number;
    totalPage: number;
    totalElements: number;
}