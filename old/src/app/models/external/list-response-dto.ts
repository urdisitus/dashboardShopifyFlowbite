export class ListResponseDto<TData>{
    data?: TData[];
    nextPageInfo?: string;
    previousPageInfo?: string;
}