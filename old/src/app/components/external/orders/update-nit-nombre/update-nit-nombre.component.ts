import { ToastrService } from 'ngx-toastr';
import { Utils } from './../../../../providers/utils';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NitNombreOrderParam } from 'src/app/models/external/order/nit-nombre-order-param';
import { ServiceUpdNitNombreOrder } from 'src/app/services/external/order/upd.nit.nombre.order.service';
import { NgbModal, NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { OrderListItemDto } from 'src/app/models/external/order/order-list-item-dto';
import { DataBag } from '../order-list/order-list.component';
import { TipoDocumentoSFE } from '../../../../models/external/order/tipo-documento-sfe';

@Component({
  selector: 'app-update-nit-nombre',
  templateUrl: './update-nit-nombre.component.html',
  styleUrls: ['./update-nit-nombre.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class UpdateNitNombreComponent implements OnInit {

  public cardnumbers = false;
  public CARDNUMBERS = "CARD_NUMBERS";
  public cardNumberFirst = '';
  public cardNumberSecond = '';
  public tipoList: TipoDocumentoSFE[];
  public tipoFacturacion : number=0;
  param: NitNombreOrderParam = {};
  order: OrderListItemDto = {};

  constructor(
    private _toastr: ToastrService,
    public service: ServiceUpdNitNombreOrder,
    public modal: NgbActiveModal
  ) {

  }

  ngOnInit() {
  }

  dismissModal(){
    this.modal.dismiss('cancel click');
  }

  setOrder(order: OrderListItemDto, pTipoDoc: TipoDocumentoSFE[], pTipoFactuacion: number) {
    this.order = order;
    this.cardnumbers = order.formaPagoKeys && order.formaPagoKeys.indexOf(this.CARDNUMBERS) > -1;
    this.param.ordenId = order.id;
    this.param.nit = order.invoiceNumber;
    this.param.nombre = order.invoiceName;
    this.tipoList = pTipoDoc;
    this.tipoFacturacion = pTipoFactuacion;
    this.param.complemento = order.invoiceComplement;
    this.param.idTipoDocumento = order.invoiceTypeDoc;
    this.param.documento = order.invoiceDocument;
    this.param.correo = order.invoiceEmail;
    this.param.telefono = order.invoicePhone;
    this.param.tipoFacturacion = pTipoFactuacion;
    this.param.cardNumber = order.invoiceCardNumber;

    if(this.param.cardNumber && this.param.cardNumber.length === 16){
      this.cardNumberFirst = this.param.cardNumber.substring(0, 4);
      this.cardNumberSecond = this.param.cardNumber.substring(12, 16);
    }
  }

  guardar(){
    // Validar
    if(this.cardnumbers){
      if(!this.cardNumberFirst || this.cardNumberFirst.length !== 4){
        this._toastr.error('Son requeridos los primeros 4 dígitos de la tarjeta.', 'Error');
        return ;
      }
      if(!this.cardNumberSecond || this.cardNumberFirst.length !== 4){
        this._toastr.error('Son requeridos los últimos 4 dígitos de la tarjeta.', 'Error');
        return ;
      }
    }
    this.param.tipoDocumento = this.tipoList.filter(e => e.id == this.param.idTipoDocumento)[0].descript;
    if(this.cardnumbers && this.cardNumberFirst && this.cardNumberSecond){
      this.param.cardNumber = `${this.cardNumberFirst}XXXXXXXX${this.cardNumberSecond}`;
    }
    this.service.update(this.param).then((result: OrderListItemDto)=>{
      this.modal.close(result);
        this.dismissModal();
    });
  }

  keyPress(event: KeyboardEvent) {
    const pattern = /[0-9]/;
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      // invalid character, prevent input
      event.preventDefault();
    }
  }

  public selectTipo(value: number): void {
    if (value != 1) {
      this.param.complemento = '';
    }
  }
}
