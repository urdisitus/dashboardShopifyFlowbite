import { Component, OnInit } from '@angular/core';
import { NitNombreOrderParam } from 'src/app/models/external/order/nit-nombre-order-param';
import { ServiceUpdNitNombreOrder } from 'src/app/services/external/order/upd.nit.nombre.order.service';
import { NgbModal, NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { OrderListItemDto } from 'src/app/models/external/order/order-list-item-dto';
import { ClienteParam } from 'src/app/models/external/client/cliente-param';
import { ServiceCreateCliente } from 'src/app/services/external/client/create-cliente.service';
import { ClienteResult } from 'src/app/models/external/client/cliente-result';
import { ServiceVincularCliente } from 'src/app/services/external/client/vincular-cliente.service';
import { ClienteFarmacorpDto } from 'src/app/models/external/client/cliente-farmacorp-dto';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-create-client',
  templateUrl: './create-client.component.html',
  styleUrls: ['./create-client.component.css']
})
export class CreateClientComponent implements OnInit {
  param: ClienteParam = {
    noCia : environment.configuration.noCia
  };
  now: Date = new Date();
  birthDate: { year: number; month: number; day: number; };

  constructor(
    private createService: ServiceCreateCliente,
    public service: ServiceVincularCliente,
    public modal: NgbActiveModal
  ) {

  }

  ngOnInit() {
  }

  dateToObjDate(date: Date) {
    return {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate()
    };
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

  setParam(element: ClienteFarmacorpDto) {
    this.param = {
      noCia:environment.configuration.noCia,
      nombres: element.nombres,
      apellidos: element.apellidos,
      cedula: element.cedula,
      celular: element.celular,
      email: element.email,
      fechaNacimiento: element.fechaNacimiento,
      idCliente: element.idCodigo,
      idFarmacorp: element.idCliente,
      idGrupo: element.idGrupo
    }
  }

  guardar() {
    this.param.fechaNacimiento = this.birthDate ? new Date(this.birthDate.year, this.birthDate.month - 1, this.birthDate.day, 0, 0, 0).toDateString() : '';
    if (this.param.idFarmacorp) {
      this.createService.postCliente(this.param).then((result: ClienteResult) => {
        this.modal.close(result);
        this.dismissModal();
      });
    } else {
      this.service.postCliente(this.param).then((result: ClienteResult) => {
        this.modal.close(result);
        this.dismissModal();
      });
    }
  }
}
