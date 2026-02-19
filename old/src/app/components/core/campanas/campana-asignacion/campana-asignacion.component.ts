import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { PreaperturaResult } from 'src/app/dataTransferObjects/preapertura/preapertura';
import { Utils } from 'src/app/providers/utils';
import { ApiArqueoService } from 'src/app/services/core/preapertura/arqueo.service';

@Component({
  selector: 'app-campana-asignacion',
  templateUrl: './campana-asignacion.component.html',
  styleUrls: ['./campana-asignacion.component.css']
})
export class CampanaAsignacionComponent implements OnInit {
  public preapertura: PreaperturaResult;
  public value: number;
  public comentario: string = '';
  public cantAsignada: number = 0;

  constructor(
    public service: ApiArqueoService,
    private toastr: ToastrService,
    public modal: NgbActiveModal
  ) { }

  ngOnInit() {
  }

  dismissModal() {
    this.modal.dismiss('cancel click');
  }

  keyPress(event: KeyboardEvent) {
    const pattern = /[-+0-9]/;
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      // invalid character, prevent input
      event.preventDefault();
    }
  }

  setData(item: PreaperturaResult){
    this.preapertura = item;
    this.cantAsignada = item.cantAsignado;    
  }

  onCantidadChange(){
    if(this.value){
      this.cantAsignada =  this.preapertura.cantAsignado +  this.value;
    }else{
      this.cantAsignada =  this.preapertura.cantAsignado;
    }    
  }

  guardar() {
    if(this.value != 0){
      this.service.asignar({
        campanaArqueoStickerId : this.preapertura.id,
        observacion: this.comentario,
        value: this.value,
        usuarioId : this.preapertura.cajeroUsuario      
      }).then((result: PreaperturaResult) => {
        this.toastr.success('Se realizó la asignación de manera exitosa.', 'Asignación de Stickers', { progressAnimation: 'decreasing', timeOut: 3000 });
        this.modal.close(result);
        this.dismissModal();
      });
    }else{
      this.toastr.error('Valor', 'El valor ingresado debe ser mayor a 0', { progressAnimation: 'decreasing', timeOut: 3000 });
    }
  }
}
