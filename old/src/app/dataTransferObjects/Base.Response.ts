 export class BaseResponse<TElement> {
        code: number;
        data: TElement;
        errors: ErrorResponse[];
        dateTime: Date;
}


export class ErrorResponse {
  code: string;
  message: string;
  moreInfo?: any;
}
