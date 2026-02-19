import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { List } from 'linqts';
import { ToastrService } from 'ngx-toastr';
import { ArqueoDetalleDto, ArqueoDto, TurnoDto } from 'src/app/models/external/arqueo/ArqueoRecuperarResult';
import { PagoTipoItem } from 'src/app/models/external/arqueo/PagoTipoResult';
import { ServiceArqueo } from 'src/app/services/external/arqueo/arqueo.service';
import { ServiceTurno } from 'src/app/services/external/arqueo/turno.service';

import jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import { ExecutingService } from 'src/app/services/shared/executing.service';

@Component({
  selector: 'app-arqueo-voucher',
  templateUrl: './arqueo-voucher.component.html',
  styleUrls: ['./arqueo-voucher.component.css']
})
export class ArqueoVoucherComponent implements OnInit {

  public turno: TurnoDto = {};
  public arqueo: ArqueoDto = {};
  public comentario: string = '';
  public detalle: ArqueoDetalleDto[] = [];
  public tipoPago: PagoTipoItem[] = [];
  public printOnLoad: boolean;

  constructor(
    public serviceTurno: ServiceTurno,
    public _executingService: ExecutingService,
    public service: ServiceArqueo,
    private toastr: ToastrService,
    public modal: NgbActiveModal) { }

  ngOnInit() {
    this.cargarPagos();
  }

  setData(turno: TurnoDto, printOnLoad: boolean) {
    this.turno = turno;
    this.arqueo = turno.arqueo[0];
    this.detalle = this.arqueo.arqueoDetalle;
    this.printOnLoad = printOnLoad;
  }

  private cargarPagos() {
    this.serviceTurno.tipoPago()
      .then((response: PagoTipoItem[]) => {
        this.tipoPago = response;
        this.detalle = new List<ArqueoDetalleDto>(this.arqueo.arqueoDetalle).Where(x => !!this.getTipoPagoDescripcion(x.tipoPagoId)).ToArray();
        setTimeout(() => {
          if (this.printOnLoad) {
            this.imprimir();
            this.printOnLoad = false;
          }
        }, 500);
      });
  }

  getDiferencia(pago: ArqueoDetalleDto) {
    return pago.montoRegenteBs - pago.montoSistema
  }

  getTotalDiferencia() {
    return this.arqueo.regenteMontoTotalBs - this.arqueo.montoTotalSistema;
  }

  getTipoPagoDescripcion(tipoPagoId: number): string {
    return new List<PagoTipoItem>(this.tipoPago)
      .Where(x => x.id === tipoPagoId)
      .Select(x => x.descripcion)
      .FirstOrDefault();
  }

  dismissModal() {
    this.modal.dismiss('cancel click');
  }

  private getTagsHtml(tagName: keyof HTMLElementTagNameMap): string {
    const htmlStr: string[] = [];
    const elements = document.getElementsByTagName(tagName);
    for (let idx = 0; idx < elements.length; idx++) {
      htmlStr.push(elements[idx].outerHTML);
    }

    return htmlStr.join('\r\n');
  }


  imprimir() {
    var mywindow = window.open('', 'PRINT', 'height=400,width=600');
    const stylesHtml = this.getTagsHtml('style');
    const linksHtml = this.getTagsHtml('link');
    mywindow.document.write('<html><head>');
    mywindow.document.write(`${linksHtml}${stylesHtml}`);
    mywindow.document.write('</head><body >');
    mywindow.document.write(document.getElementById("imprimible").innerHTML);
    mywindow.document.write('</body></html>');

    mywindow.document.close(); // necessary for IE >= 10
    mywindow.focus(); // necessary for IE >= 10*/

    setTimeout(() => {
      mywindow.print();
      mywindow.close();
    }, 800);

    return true;
  }
}
