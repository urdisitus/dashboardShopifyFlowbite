export interface SearchCustomerParam {
    id?:string;
    nombres?:string;
    email?:string;
    phone?:string;
    limit?:string;
    pageInfo?:string;
    loadMore?: boolean,
}