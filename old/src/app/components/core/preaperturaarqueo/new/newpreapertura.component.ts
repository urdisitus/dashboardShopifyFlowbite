import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BuscarUsuarioComponent } from '../../usuarios/buscar-usuario/buscar-usuario.component';
import { PreaperturaResult } from 'src/app/dataTransferObjects/preapertura/preapertura';
import { UsuarioListado } from 'src/app/models/security/administration/user/UsuarioListado';

@Component({
  selector: 'new-preapertura',
  templateUrl: './newpreapertura.component.html',
   styleUrls: [ './newpreapertura.component.css']
})
export class NewPreaperturaComponent {

  public preapertura: PreaperturaResult = new PreaperturaResult();
  constructor(
    public modal: NgbActiveModal,
    private _modalService: NgbModal) {

  }

  public buscarUsuario() {
    var newModal = this._modalService.open(BuscarUsuarioComponent, { size: 'lg', windowClass: 'animated slideInUp modal-xxl '});

    newModal.result.then((result: UsuarioListado) => {
      this.preapertura.cajeroUsuario = result.id.toString();
    }, (reason) => {
      
    });

  }

}
