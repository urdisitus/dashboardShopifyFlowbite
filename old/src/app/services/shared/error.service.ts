import { Injectable, Component, Input } from '@angular/core';
import { Subject } from 'rxjs';
import { ErrorResponse } from 'src/app/dataTransferObjects/Base.Response';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'ngbd-modal-confirm-autofocus',
  template: `
  <div class="modal-header modal-header-danger" >
    <h4 class="modal-title modal-header-text-danger" id="modal-title">Aviso</h4>
    <button type="button" class="close" style="color:#fff" aria-label="Close button" aria-describedby="modal-title" (click)="onDismiss()">
      <span aria-hidden="true">&times;</span>
    </button>
  </div>
  <div class="modal-body">
    <p><span style="font-size:16px">Se reportan los siguientes errores</span></p>
    <ul style="list-style-type:disc;">
      <li *ngFor="let alert of errors">{{ alert.message }}</li>
    </ul>  
  </div>
  <div class="modal-footer">
    <button type="button" ngbAutofocus class="btn btn-danger" (click)="onClose()">Ok</button>
  </div>
  `,
  styles: [
    `
    .modal-content{
      animation- name: example;
      animation - duration: 0.3s;
    }

    @keyframes example {
       0 % { transform: scale(0.5) }
      75 % { transform: scale(1.1) }
      100 % { transform: scale(1) }
    }
    `
  ]

})
export class NgbdModalConfirmAutofocus {

  @Input()
  public errors: Array<ErrorResponse>;

  public logicErrorCallback?: (code: string, message: string, errors: ErrorResponse[]) => void;
  
  constructor(
    public modal: NgbActiveModal,
    private _toastr: ToastrService) { }

  public close(alert: ErrorResponse): void {
    this.errors.splice(this.errors.indexOf(alert), 1);

    if (this.errors.length == 0) {
      this.modal.dismiss();
    }
  }

  onDismiss() {
    this.onLogicErrorCallback();
    this.modal.dismiss('Cross click');
  }

  onClose() {
    this.onLogicErrorCallback();
    this.modal.close('Ok click');
  }

  setLogicErrorCallback(param: (code: string, message: string, errors: ErrorResponse[]) => void) {
    this.logicErrorCallback = param;
  }

  onLogicErrorCallback() {
    if (this.logicErrorCallback) {
      this.logicErrorCallback('Aviso', 'Se reportan los siguientes errores', this.errors);
    }
  }
}


@Injectable()
export class ErrorService {

  constructor(
    private _modalService: NgbModal,
    private _toastr: ToastrService) { }

  public show(param: Array<ErrorResponse>): any {
    var modalRef = this._modalService.open(NgbdModalConfirmAutofocus, { windowClass: 'animated slideInUp', backdrop: 'static' });
    modalRef.componentInstance.errors = param;
    return modalRef.componentInstance;
  }
}
