import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpResponse,
  HttpErrorResponse,
} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { retry, catchError, map, finalize } from "rxjs/operators";
import { ExecutingService } from "../shared/executing.service";
import { Injectable } from "@angular/core";
import { BaseResponse } from "src/app/dataTransferObjects/Base.Response";
import { ErrorService } from "../shared/error.service";
import { ToastrService } from "ngx-toastr";

@Injectable()
export class AppHttpInterceptor implements HttpInterceptor {
  constructor(
    private _errorService: ErrorService,
    private _executingService: ExecutingService,
    private _toastr: ToastrService
  ) { }
  public intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (!request.headers.get("noShowLoading")) {
      this._executingService.show();
    } else {
      request.headers.delete("noShowLoading");
    }
    return next.handle(request).pipe(
      finalize(() => this._executingService.hide()),
      retry(1),
      map((resp) => {
        // on Response
        if (resp && resp instanceof HttpResponse && resp.body) {
          // Do whatever you want with the response.
          var resObj = resp.body as BaseResponse<any>;
          if (resObj.errors && resObj.errors.length > 0 && !request.headers.get("noShowDialogError")) {
            if (!request.headers.get("no_throw")) {
              throw new HttpErrorResponse({
                error: resObj.errors,
                headers: resp.headers,
                status: 500,
                statusText: "locErrorTest",
                url: resp.url,
              });
            }
          }
          return resp;
        }
      }),
      catchError((error: HttpErrorResponse) => {
        let errorMessage = "";
        if (error.statusText === "locErrorTest") {
          var modal = this._errorService.show(error.error);
          return throwError({
            errorMessage: errorMessage,
            error: error.error,
            modal: modal,
          });
        } else if (
          error['error']
          && error['error'].errors
          && error['error'].errors.length > 0
          && !request.headers.get("noShowDialogError")
          && !request.headers.get("no_throw")
        ) {
          var modal = this._errorService.show(error['error'].errors);
          return throwError({
            errorMessage: error['error'].message,
            error: error['error'].errors,
            modal: modal,
          });
        } else {
          errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
          this._toastr.error(errorMessage, "Error", {
            progressAnimation: "decreasing",
            timeOut: 10000,
          });
          return throwError(errorMessage);
        }
      })
    );
  }
}
