import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ErrorResponse } from 'src/app/dataTransferObjects/Base.Response';
import { IResetPasswordRequestDto } from 'src/app/models/security/session/reset.password.request.dto';
import { Utils } from 'src/app/providers/utils';
import { ResetPasswordService } from 'src/app/services/security/session/Impl/reset_password.service';
import { SessionService } from 'src/app/services/security/session/Impl/session.service';

export const confirmPasswordValidator: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
  const new_password = control.get('new_password');
  const confirm_password = control.get('confirm_password');

  return new_password &&
    confirm_password &&
    new_password.value !== confirm_password.value ? { 'confirmPassword': true } : null;
};

@Component({
  selector: 'app-resetpasswordtoken',
  templateUrl: './resetpasswordtoken.component.html',
  styleUrls: ['./resetpasswordtoken.component.css']
})
export class ResetpasswordtokenComponent implements OnInit {

  modelForm: FormGroup;
  userId: number;
  id: number;
  constructor(
    private _modalService: NgbModal,
    private route: ActivatedRoute,
    private resetPasswordService: ResetPasswordService,
    private session: SessionService,
    private router: Router,
    private _toastr: ToastrService
  ) {
    this.route.queryParams.subscribe(params => {
      this.resetPasswordService.getResetPasswordRequest(this.route.snapshot.paramMap.get('token'), (code: string, message: string, errors: ErrorResponse[]) => {
        this.goLogin();
      }).then((result: IResetPasswordRequestDto) => {
        this.id = result.id;
        this.userId = result.userId;
      });
    });
  }

  ngOnInit() {
    this.modelForm = new FormGroup({
      'new_password': new FormControl('', [
        Validators.required,
        Validators.maxLength(25)
      ]),
      'confirm_password': new FormControl('', [
        Validators.required,
        Validators.maxLength(25),
      ]),
    }, { validators: confirmPasswordValidator });
  }

  public change_password(): void {
    if (!this.userId) {
      return;
    }
    if (!this.modelForm.get('new_password').value) {
      return;
    }
    if (!this.modelForm.get('confirm_password').value) {
      return;
    }
    this.session.reset_password(
      this.userId,
      this.modelForm.get('new_password').value,
      this.id).then((result: boolean) => {
        Utils.aviso('Se ha establecido la contraseña correctamente.', () => {
          this.session.login(
            this.userId.toString(),
            this.modelForm.get('new_password').value,
            true).then((userInfo: IUserInfo) => {
              this.userId = null;
              this.modelForm.setValue({
                new_password: null,
                confirm_password: null
              });
              this.router.navigate(['/home']);
            });
        });
      });
  }

  goLogin() {
    this.router.navigate(['/login']);
  }

  get new_password() { return this.modelForm.get('new_password'); }

  get confirm_password() { return this.modelForm.get('confirm_password'); }
}
