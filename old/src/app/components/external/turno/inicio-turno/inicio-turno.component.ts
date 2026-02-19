import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ServiceVincularCliente } from 'src/app/services/external/client/vincular-cliente.service';
import { ServiceTurno } from 'src/app/services/external/arqueo/turno.service';
import { TurnoDto } from 'src/app/models/external/arqueo/ArqueoRecuperarResult';
import { ToastrService } from 'ngx-toastr';
import { Utils } from 'src/app/providers/utils';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-inicio-turno',
  templateUrl: './inicio-turno.component.html',
  styleUrls: ['./inicio-turno.component.css'],
  providers: [DatePipe]
})
export class InicioTurnoComponent implements OnInit {

  public montoApertura: number;
  public comentario: string = '';

  constructor(
    public datepipe: DatePipe,
    public service: ServiceTurno,
    private toastr: ToastrService,
    public modal: NgbActiveModal
  ) { }

  ngOnInit() {
  }

  dismissModal() {
    this.modal.dismiss('cancel click');
  }

  keyPress(event: KeyboardEvent) {
    const pattern = /[0-9]/;
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      // invalid character, prevent input
      event.preventDefault();
    }
  }

  guardar() {
    this.service.iniciar(
      this.montoApertura,
      this.comentario
    ).then((result: TurnoDto) => {
      this.toastr.success('Turno iniciado exitosamente.', 'Turno');
      this.modal.close(result);
      this.dismissModal();
      const fecha = new Date(result.fecha.toString());
      Utils.showAlert('Turno', `Turno iniciado para la fecha ${this.datepipe.transform(fecha, 'dd/MM/yyyy')}.`);
    });
  }
}
