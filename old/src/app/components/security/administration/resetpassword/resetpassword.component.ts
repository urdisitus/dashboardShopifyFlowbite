import { Component, OnInit } from '@angular/core';
import { ValidatorFn, FormGroup, ValidationErrors, Validators, FormControl } from '@angular/forms';
import { SessionService } from 'src/app/services/security/session/Impl/session.service';
import { NgbModalConfig, NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { UsuarioListado } from 'src/app/models/security/administration/user/UsuarioListado';
import { BuscarUsuarioComponent } from 'src/app/components/core/usuarios/buscar-usuario/buscar-usuario.component';

export const confirmPasswordValidator: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
  const new_password = control.get('new_password');
  const confirm_password = control.get('confirm_password');

  return new_password &&
    confirm_password &&
    new_password.value !== confirm_password.value ? { 'confirmPassword': true } : null;
};

@Component({
  selector: 'app-resetpassword',
  templateUrl: './resetpassword.component.html',
  styleUrls: ['./resetpassword.component.css']
})
export class ResetpasswordComponent implements OnInit {

  modelForm: FormGroup;
  usuarioListado: UsuarioListado = {};
  fromuser: boolean = false;

  constructor(
    private session: SessionService,
    private _toastr: ToastrService,
    private _modalService: NgbModal,
    public modal: NgbActiveModal
  ) {
    this.configureForm();
  }

  public searchUser() {
    if(!this.fromuser){
      var newModal = this._modalService.open(BuscarUsuarioComponent, { size: 'lg', windowClass: 'animated slideInUp modal-xxl ' });
      newModal.result.then((result: UsuarioListado) => {
        this.usuarioListado = result;
        this.modelForm.setValue({
          user_id: result.id,
          new_password: this.modelForm.get('new_password').value,
          confirm_password: this.modelForm.get('confirm_password').value
        });
      });
    }    
  }

  configureForm() {
    this.modelForm = new FormGroup({
      'user_id': new FormControl('', [
        Validators.required
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

  ngOnInit(): void {
  }

  setData(user: UsuarioListado){
    this.fromuser = true;
    this.usuarioListado = user;
    this.modelForm.setValue({
      user_id: user.id,
      new_password: this.modelForm.get('new_password').value,
      confirm_password: this.modelForm.get('confirm_password').value
    });
  }

  public change_password(): void {
    if (!this.modelForm.get('user_id').value) {
      return;
    }
    if (!this.modelForm.get('new_password').value) {
      return;
    }
    if (!this.modelForm.get('confirm_password').value) {
      return;
    }
    this.session.reset_password(
      this.modelForm.get('user_id').value,
      this.modelForm.get('new_password').value).then((result: boolean) => {
        this.modelForm.setValue({
          user_id: null,
          new_password: null,
          confirm_password: null
        });
        this.usuarioListado = {};
        this._toastr.success('Se ha reiniciado la contraseña correctamente.', 'Cambio de Contraseña');
        if(this.modal){
          this.modal.close();
        }
      });
  }

  get user_id() { return this.modelForm.get('user_id'); }

  get new_password() { return this.modelForm.get('new_password'); }

  get confirm_password() { return this.modelForm.get('confirm_password'); }
}
