import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { DatatableBase } from 'src/app/components/generic/component/datatable.base';
import { ClienteFarmacorpDto } from 'src/app/models/external/client/cliente-farmacorp-dto';
import { ServiceClienteFarmacorp } from 'src/app/services/external/client/cliente-farmacorp.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ClienteFarmacorpDataSource, SearchClienteFarmacorpParam } from 'src/app/services/external/client/cliente-farmacorp.datasource';
import { fromEvent, merge } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { ClienteResult } from 'src/app/models/external/client/cliente-result';
import { CreateClientComponent } from '../create-client/create-client.component';
import { ServiceShopifyCustomer } from 'src/app/services/external/client/shopify-customer-farmacorp.service';
import { Utils } from 'src/app/providers/utils';

@Component({
  selector: 'app-buscar-client',
  templateUrl: './buscar-client.component.html',
  styleUrls: ['./buscar-client.component.css']
})
export class BuscarClientComponent extends DatatableBase<ClienteFarmacorpDto> implements OnInit, AfterViewInit {

  public _dataSource: ClienteFarmacorpDataSource;
  param: SearchClienteFarmacorpParam = {
    cedula: '',
    email: '',
    nombres: ''
  };
  public displayedColumns: string[] = ['event', 'idShopify', 'idCliente', 'nombres', 'apellidos', 'cedula', 'email'];
  public initialSize: number = 10;

  @ViewChild('inputCedula') inputCedula: ElementRef;
  @ViewChild('inputNombres') inputNombres: ElementRef;
  @ViewChild('inputEmail') inputEmail: ElementRef;

  constructor(
    private serviceShopifyCustomer: ServiceShopifyCustomer,
    private service: ServiceClienteFarmacorp,
    public modalService: NgbModal) {
    super(modalService);
    this._dataSource = new ClienteFarmacorpDataSource(this.service);
  }

  ngOnInit() {
  }

  subscribeInputKeyUp(nativeElement: any) {
    fromEvent(nativeElement, 'keyup')
      .pipe(
        debounceTime(150),
        distinctUntilChanged(),
        tap(() => {
          this.paginator.pageIndex = 0;
          this.search();
        })
      ).subscribe();
  }

  ngAfterViewInit(): void {
    merge(this.paginator.page)
      .pipe(
        tap(() => this.search())
      ).subscribe();
  }

  search() {
    this._dataSource.search(
      this.param,
      this.paginator.pageIndex + 1,
      this.paginator.pageSize);
  }

  vinculate(element: ClienteFarmacorpDto) {
    var newModal = this._modalService.open(CreateClientComponent, {
      windowClass: 'animated slideInUp',
      size: 'sm'
    });
    newModal.componentInstance.setParam(element);
    newModal.result.then((result: ClienteResult) => {
      this.paginator.pageIndex = 0;
      this.inputCedula.nativeElement.value = result.cedula;
      this.inputEmail.nativeElement.value = '';
      this.inputNombres.nativeElement.value = '';
      this.search();
      Utils.showAlert(
        'Aviso',
        `Se ha realizado la Réplica en Shopify exitosamente.`,
        () => {

        }
      );
    });
    return newModal;
  }

  create() {
    var newModal = this._modalService.open(CreateClientComponent, {
      windowClass: 'animated slideInUp',
      size: 'sm'
    });
    newModal.result.then((result: ClienteResult) => {
      this.paginator.pageIndex = 0;
      this.param.cedula = result.cedula;
      this.param.email = '';
      this.param.nombres = '';
      this.search();
      Utils.showAlert(
        'Aviso',
        `Se ha Creado en Cliente exitosamente.`,
        () => {

        }
      );
    });
    return newModal;
  }

  copyMessage(val: string) {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }
}
