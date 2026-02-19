export interface ResultPage<TElement>{
    elements?: TElement[];
    pageIndex?: number;
    pageSize?: number;
    totalElements?: number;
    totalPage?: number;
    totalFiltered?: number;
}

export interface ResultPage2<TElement> {
  data?: TElement[];
  index?: number;
  size?: number;
  totalElements?: number;
  total?: number;
  totalFiltered?: number;
}
