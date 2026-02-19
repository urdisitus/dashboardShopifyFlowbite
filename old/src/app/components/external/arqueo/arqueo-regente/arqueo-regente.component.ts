import { Component, OnInit } from '@angular/core';
import { TurnoDto, ArqueoDetalleDto, ArqueoDto } from 'src/app/models/external/arqueo/ArqueoRecuperarResult';
import { PagoTipoItem } from 'src/app/models/external/arqueo/PagoTipoResult';
import { ToastrService } from 'ngx-toastr';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ServiceTurno } from 'src/app/services/external/arqueo/turno.service';
import { DatePipe } from '@angular/common';
import { ServiceArqueo } from 'src/app/services/external/arqueo/arqueo.service';
import { Utils } from 'src/app/providers/utils';
import { IArqueoRegenteParam } from 'src/app/models/external/arqueo/ArqueoRegenteParam';
import { List } from 'linqts';

@Component({
  selector: 'app-arqueo-regente',
  templateUrl: './arqueo-regente.component.html',
  styleUrls: ['./arqueo-regente.component.css'],
  providers: [DatePipe]
})
export class ArqueoRegenteComponent implements OnInit {
  public turno: TurnoDto = {};
  public arqueo: ArqueoDto = {};
  public comentario: string = '';
  public detalle: ArqueoDetalleDto[] = [];
  public tipoPago: PagoTipoItem[] = [];
  public diferencia: number = 0;
  constructor(
    public datepipe: DatePipe,
    public serviceTurno: ServiceTurno,
    public service: ServiceArqueo,
    private toastr: ToastrService,
    public modal: NgbActiveModal
  ) { }

  ngOnInit() {
    this.cargarPagos();
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

  setData(turno: TurnoDto) {
    this.turno = turno;
    this.arqueo = turno.arqueo[0];
    this.detalle = this.arqueo.arqueoDetalle;
    this.diferencia = Math.abs(this.arqueo.montoTotalSistema - this.arqueo.montoTotalBs);
  }

  private cargarPagos() {
    this.serviceTurno.tipoPago()
      .then((response: PagoTipoItem[]) => {
        this.tipoPago = response;
        this.detalle = new List<ArqueoDetalleDto>(this.arqueo.arqueoDetalle).Where(x => !!this.getTipoPagoDescripcion(x.tipoPagoId)).ToArray();
      });
  }

  getTipoPagoDescripcion(tipoPagoId: number): string {
    return new List<PagoTipoItem>(this.tipoPago)
      .Where(x => x.id === tipoPagoId)
      .Select(x => x.descripcion)
      .FirstOrDefault();
  }

  guardar() {
    let param: IArqueoRegenteParam = {
      arqueoId: this.arqueo.id,
      observacionRegente: this.comentario,
      arqueoDetalle: this.detalle.map((pago) => {
        return {
          arqueoDetalleId: pago.id,
          monto: pago.montoRegente
        };
      })
    };
    this.service.regente(param).then((result: TurnoDto) => {
      this.toastr.success('Arqueo realizado exitosamente.', 'Arqueo');
      this.modal.close(result);
      this.dismissModal();
      Utils.showAlert('Arqueo', `El Arqueo de Regente fue realizado exitosamente.`);
    });
  }
}
