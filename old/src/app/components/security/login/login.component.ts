import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SessionService } from 'src/app/services/security/session/Impl/session.service';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { ResetpasswordrequestComponent } from '../resetpasswordrequest/resetpasswordrequest.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  toRedirect: string = '/';
  modelForm: FormGroup;

  constructor(
    private _modalService: NgbModal,
    private route: ActivatedRoute,
    private session: SessionService,
    private router: Router) {
    if (this.route.snapshot.queryParams['returnUrl']) {
      this.toRedirect = this.route.snapshot.queryParams['returnUrl'];
    }
    //Obtener recordado
    this.session.sessionProvider.getUserRemind()
      .then((userName: string) => {
        let remind: boolean = false;
        if (!userName) {
          userName = '';
        } else {
          remind = true;
        }
        this.modelForm = new FormGroup({
          'userName': new FormControl(userName, [
            Validators.required,
            Validators.maxLength(100)
          ]),
          'password': new FormControl('', [
            Validators.required,
            Validators.maxLength(25)
          ]),
          'remind': new FormControl(remind),
        });
      });
  }

  public ngOnInit(): void {
    if (environment.production) {
      if (location.protocol === 'http:') {
        //window.location.href = location.href.replace('http', 'https');
      }
    }
  }

  public login(): void {
    if (!this.modelForm.get('userName').value) {
      return;
    }
    if (!this.modelForm.get('password').value) {
      return;
    }
    this.session.login(
      this.modelForm.get('userName').value,
      this.modelForm.get('password').value,
      this.modelForm.get('remind').value).then((userInfo: IUserInfo) => {
        this.toRedirect = '/home';
        this.router.navigate([this.toRedirect]);
      });
  }

  resetPassword() {
    const modalRef = this._modalService.open(ResetpasswordrequestComponent, {
      windowClass: 'animated slideInUp',
      size: 'sm',
      backdrop: 'static'
    });
    modalRef.componentInstance.userNameDefault = this.modelForm.get('userName').value;
  }

  public reset(): void {
    this.modelForm.patchValue({
      userName: this.modelForm.get('userName').value,
      password: '',
      remind: this.modelForm.get('remind').value
    });
  }

  get userName() { return this.modelForm.get('userName'); }

  get password() { return this.modelForm.get('password'); }

  get remid() { return this.modelForm.get('remind'); }
}
