import { Component, OnInit } from '@angular/core';
import { ColumnDef } from '../../orders/order-list/order-list.component';
import { SearchCustomerParam } from 'src/app/models/external/client/search-customer-param';
import { CustomerDto } from 'src/app/models/external/client/customer-dto';
import { ListResponseDto } from 'src/app/models/external/list-response-dto';
import { CustomerListDataSource } from 'src/app/services/external/client/customer.list..datasource';
import { List } from 'linqts';
import { ToastrService } from 'ngx-toastr';
import { ServiceShopifyCustomer } from 'src/app/services/external/client/shopify-customer-farmacorp.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddressListComponent } from '../address-list/address-list.component';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.css']
})
export class CustomerListComponent implements OnInit {

  columns: ColumnDef[] = [
    {
      name: 'actions',
      title: 'Acciones',
      custom: true
    },
    {
      name: 'id',
      title: 'Código'
    },
    {
      name: 'first_name',
      title: 'Nombres'
    },
    {
      name: 'last_name',
      title: 'Apellidos'
    },
    {
      name: 'phone',
      title: 'Teléfono'
    },
    {
      name: 'addresses',
      title: 'Direcciones',
      custom: true
    },
    {
      name: 'email',
      title: 'Correo Electrónico'
    },
    {
      name: 'verified_email',
      title: 'Correo Verificado',
      custom: true
    },
    {
      name: 'orders_count',
      title: 'Ordenes'
    },
    {
      name: 'total_spent',
      title: 'Total Gastado'
    },
  ];

  param: SearchCustomerParam = {
    limit: '100',
    email: '',
    phone: '',
    id: '',
    nombres: '',
    loadMore: true,
  };

  listResponseDto: ListResponseDto<CustomerDto> = {};

  dataSource: CustomerListDataSource;

  displayedColumns: string[] = this.columnList().Select(x => x.name).ToArray();

  autoColumns: ColumnDef[] = this.columnList().Where(x => !x.custom).ToArray();

  columnList(): List<ColumnDef> {
    return new List<ColumnDef>(this.columns);
  }

  constructor(
    private _toastr: ToastrService,
    private serviceList: ServiceShopifyCustomer,
    private _modalService: NgbModal) { }

  ngOnInit() {
    this.dataSource = new CustomerListDataSource(this.serviceList);
  }

  dataList(): List<CustomerDto> {
    return new List<CustomerDto>(this.dataSource.data);
  }

  reload() {
    this.cleanData();
    this.fetchNext();
  }

  cleanData() {
    this.param.loadMore = true;
    this.dataSource.data = [];
    this.listResponseDto = {
      data: []
    };
  }

  fetchNext() {
    this.param.pageInfo = this.listResponseDto.nextPageInfo;
    if (this.param.id) {
      this.param.nombres = '';
      this.param.email = '';
    }
    this.dataSource.orders(this.param).then((response: ListResponseDto<CustomerDto>) => {
      this.listResponseDto = response;
      if (!response.nextPageInfo) {
        this.param.loadMore = false;
      }
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

  openAddress(customer: CustomerDto) {
    this.serviceList.get(customer.id.toString()).then(
      (result: CustomerDto) => {
        var newModal = this._modalService.open(AddressListComponent, { size: 'lg', windowClass: 'animated slideInUp modal-xxl ' });
        newModal.componentInstance.setData(result);
      }
    );
  }
}
