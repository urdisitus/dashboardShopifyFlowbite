import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators, ValidatorFn, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SessionService } from 'src/app/services/security/session/Impl/session.service';
import { NgbModalConfig, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

export const confirmPasswordValidator: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
    const new_password = control.get('new_password');
    const confirm_password = control.get('confirm_password');

    return new_password &&
        confirm_password &&
        new_password.value !== confirm_password.value ? { 'confirmPassword': true } : null;
};

@Component({
    selector: 'app-change_password',
    templateUrl: './change_password.component.html',
    styleUrls: ['./change_password.component.css']
})
export class ChangePasswordComponent implements OnInit {

    @ViewChild('content') content: any;
    modelForm: FormGroup;
    modal: NgbModalRef;

    constructor(
        private session: SessionService,
        public config: NgbModalConfig,
        private modalService: NgbModal,
        private _toastr: ToastrService,
    ) {
        config.backdrop = 'static';
        config.keyboard = false;
        this.configureForm();
    }

    configureForm() {
        this.modelForm = new FormGroup({
            'password': new FormControl('', [
                Validators.required,
                Validators.maxLength(25)
            ]),
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

    open() {
        this.configureForm();
        this.modal = this.modalService.open(this.content, {});
    }

    close(modal) {
        modal.dismiss('Cross click');
    }

    public ngOnInit(): void {

    }

    public change_password(): void {
        if (!this.modelForm.get('password').value) {
            return;
        }
        if (!this.modelForm.get('new_password').value) {
            return;
        }
        if (!this.modelForm.get('confirm_password').value) {
            return;
        }
        this.session.change_password(
            this.modelForm.get('password').value,
            this.modelForm.get('new_password').value).then((userInfo: IUserInfo) => {
                this._toastr.success('Se ha cambiado la contraseña correctamente.', 'Cambio de Contraseña');
                this.close(this.modal);
            });
    }

    get password() { return this.modelForm.get('password'); }

    get new_password() { return this.modelForm.get('new_password'); }

    get confirm_password() { return this.modelForm.get('confirm_password'); }
}
