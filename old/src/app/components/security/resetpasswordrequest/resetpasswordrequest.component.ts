import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Utils } from 'src/app/providers/utils';
import { ResetPasswordService } from 'src/app/services/security/session/Impl/reset_password.service';
import { SessionService } from 'src/app/services/security/session/Impl/session.service';

@Component({
  selector: 'app-resetpasswordrequest',
  templateUrl: './resetpasswordrequest.component.html',
  styleUrls: ['./resetpasswordrequest.component.css']
})
export class ResetpasswordrequestComponent implements OnInit {

  modelForm: FormGroup;
  userNameDefault = '';

  constructor(
    private session: SessionService,
    private resetPasswordService: ResetPasswordService,
    public modal: NgbActiveModal,
    private _modalService: NgbModal,
    private _toastr: ToastrService
  ) {
  }

  ngOnInit() {
    this.modelForm = new FormGroup({
      'userName': new FormControl(this.userNameDefault, [
        Validators.required,
        Validators.maxLength(100)
      ])
    });
  }

  public sendRequest(): void {
    if (!this.modelForm.get('userName').value) {
      return;
    }
    this.resetPasswordService.resetPasswordRequest(
      this.modelForm.get('userName').value).then((message: string) => {
        this._toastr.success(message, 'Aviso');
        this.modal.close();
      });
  }

  get userName() { return this.modelForm.get('userName'); }
}
