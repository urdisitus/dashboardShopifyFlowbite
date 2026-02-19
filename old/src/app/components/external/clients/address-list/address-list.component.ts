import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { CustomerDto } from 'src/app/models/external/client/customer-dto';
import { CustomerAddressDto } from 'src/app/models/external/client/customer-address-dto';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ServiceClienteFarmacorp } from 'src/app/services/external/client/cliente-farmacorp.service';
import { Utils } from 'src/app/providers/utils';
import { ToastrService } from 'ngx-toastr';
import { ServiceShopifyCustomer } from 'src/app/services/external/client/shopify-customer-farmacorp.service';
import { AddressFormComponent } from '../address-form/address-form.component';

@Component({
  selector: 'app-address-list',
  templateUrl: './address-list.component.html',
  styleUrls: ['./address-list.component.css']
})
export class AddressListComponent implements OnInit {

  displayedColumns: string[] = [
    'actions',
    'address1',
    'default',
    'hasLatLng',
    'phone',
    'city'
  ];

  data: CustomerDto = {
    addresses: []
  };
  dataSource = new MatTableDataSource<CustomerAddressDto>(this.data.addresses);

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private toastr: ToastrService,
    public service: ServiceShopifyCustomer,
    public _modalService: NgbModal,
    public modal: NgbActiveModal
  ) {
  }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
  }

  hasLatLng(element: CustomerAddressDto) {
    if (element.latLng && element.latLng.latitud !== null && element.latLng.longitud !== null) {
      return "Si";
    }
    return "No";
  }

  edit(element: CustomerAddressDto) {
    var newModal = this._modalService.open(AddressFormComponent, {
      windowClass: 'animated slideInUp',
      size: 'lg'
    });
    newModal.componentInstance.setData(this.data, element);
    newModal.result.then((result: CustomerDto) => {
      this.toastr.success('Se han guardado la dirección exitosamente.', 'Dirección de Cliente');
      this.setData(result);
    });
    return newModal;
  }

  create() {
    this.edit({
      customer_id: this.data.id
    });
  }

  setData(element: CustomerDto) {
    this.data = element;
    this.dataSource = new MatTableDataSource<CustomerAddressDto>(this.data.addresses);
  }

  markAsDefault(element: CustomerAddressDto) {
    Utils.confirm(
      `¿Esta seguro que desea marcar la dirección seleccionada como entrega por defecto?`,
      () => {
        this.service.markAsDefault(element.id, element.customer_id).then((result: CustomerDto) => {
          this.toastr.success('Se ha marcado la dirección seleccionada como dirección de entrega por defecto exitosamente.', 'Marcar Dirección de Entrega por Defecto');
          this.setData(result);
        });
      });
  }

  delete(element: CustomerAddressDto) {
    Utils.confirm(
      `¿Esta seguro que desea eliminar la dirección seleccionada?`,
      () => {
        this.service.delete(element).then((result: CustomerDto) => {
          this.toastr.success('Se ha eliminado la dirección seleccionada exitosamente.', 'Eliminar Dirección de Cliente');
          this.setData(result);
        });
      });
  }
}
