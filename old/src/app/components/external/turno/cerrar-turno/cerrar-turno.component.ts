import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ServiceTurno } from 'src/app/services/external/arqueo/turno.service';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { TurnoDto } from 'src/app/models/external/arqueo/ArqueoRecuperarResult';
import { PagoTipoItem } from 'src/app/models/external/arqueo/PagoTipoResult';
import { ArqueoCierreParam } from 'src/app/models/external/arqueo/ArqueoCierrerParam';
import { Utils } from 'src/app/providers/utils';
import { IPagoTipoCerrarTurnoDto } from 'src/app/models/external/arqueo/pago-tipo-cerrar-turno-dto';

@Component({
  selector: 'app-cerrar-turno',
  templateUrl: './cerrar-turno.component.html',
  styleUrls: ['./cerrar-turno.component.css'],
  providers: [DatePipe]
})
export class CerrarTurnoComponent implements OnInit {
  public turno: TurnoDto = {};
  public comentario: string = '';
  public diaLiteral: string = '';
  public mesLiteral: string = '';
  public tipoPago: IPagoTipoCerrarTurnoDto[] = [];
  constructor(
    public datepipe: DatePipe,
    public service: ServiceTurno,
    private toastr: ToastrService,
    public modal: NgbActiveModal
  ) { }

  ngOnInit() {
    this.devolver();    
  }

  public getDiaLiteral(param: TurnoDto): string {
    var dia_array = ["Domingo", "Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado"];
    return dia_array[new Date(param.fecha).getDay()];
  }

  public getMesLiteral(param: TurnoDto): string {
    var meses_array = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    return meses_array[new Date(param.fecha).getMonth()];
  }

  dismissModal() {
    this.modal.dismiss('cancel click');
  }

  private cargarPagos() {
    this.service.tipoPagoTurno(this.turno.id).then(
      (response: IPagoTipoCerrarTurnoDto[]) => {
        this.tipoPago = response;
      });
  }

  guardar() {
    let param: ArqueoCierreParam = {
      turnoId: this.turno.id,
      observacionCierre: this.comentario,
      arqueoDetalle: this.tipoPago.map((pago) => {
        return { tipoPagoId: pago.id, monto: pago.monto };
      })
    };
    this.service.cerrar(param).then((result: TurnoDto) => {
      this.toastr.success('Turno cerrado exitosamente.', 'Turno');
      this.modal.close(result);
      this.dismissModal();
      const fecha = new Date(result.fecha.toString());
      Utils.showAlert('Turno', `Turno cerrado para la fecha ${this.datepipe.transform(fecha, 'dd/MM/yyyy')}.`);
    });
  }

  devolver() {
    this.service.devolver().then((result: TurnoDto) => {
      if (!result) {
        this.toastr.success('Usted no puede hacer un cierre de turno, ya que no tiene un turno iniciado.', 'Turno');
        this.modal.close(result);
      } else {
        this.turno = result;
        this.mesLiteral = this.getMesLiteral(this.turno);
        this.diaLiteral = this.getDiaLiteral(this.turno);
        this.cargarPagos();
      }
    });
  }
}
