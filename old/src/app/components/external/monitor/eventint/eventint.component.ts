import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { List } from 'linqts';
import { Select2OptionData } from 'ng-select2';
import { ToastrService } from 'ngx-toastr';
import { fromEvent, merge } from 'rxjs';
import { Options } from 'select2';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { DatatableBase } from 'src/app/components/generic/component/datatable.base';
import { IEventIntTypeDto } from 'src/app/dataTransferObjects/monitor/eventint/event.int.type.dto';
import { ISimpleEventIntDto } from 'src/app/dataTransferObjects/monitor/eventint/simple.event.int.dto';
import { SessionProvider } from 'src/app/providers/session/session.provider';
import { EventIntDataSource } from 'src/app/services/core/monitor/event.int.datasource';
import { EventIntegrationService } from 'src/app/services/core/monitor/event.int.service';
import { IEventIntStatusDto } from 'src/app/dataTransferObjects/monitor/eventint/event.int.status.dto';
import { ResultPage } from 'src/app/models/generic/Impl/ResultPage';
import { IEventIntDto } from 'src/app/dataTransferObjects/monitor/eventint/event.int.dto';
import { ShoweventintComponent } from '../showeventint/showeventint.component';
import { Utils } from 'src/app/providers/utils';
import { BranchOfficeDto } from 'src/app/models/external/location/BranchOfficeDto';
import { ServiceLocation } from 'src/app/services/external/location/location.service';

@Component({
  selector: 'app-eventint',
  templateUrl: './eventint.component.html',
  styleUrls: ['./eventint.component.css'],
  providers: [DatePipe]
})
export class EventintComponent extends DatatableBase<ISimpleEventIntDto> implements OnInit, AfterViewInit {

  public _dataSource: EventIntDataSource;
  public startDate: Date;
  public endDate: Date;
  public initialSize: number = 10;

  public eventIntTypesSelected: string[] = [];
  public eventIntTypes: IEventIntTypeDto[] = [];
  public eventIntTypesData: Array<Select2OptionData>;
  public eventIntTypesConfig: Options = {
    multiple: true,
    tags: true,
    closeOnSelect: true,
    width: 200
  };

  public eventIntStatusSelected: string[] = [];
  public eventIntStatus: IEventIntTypeDto[] = [];
  public eventIntStatusData: Array<Select2OptionData>;
  public eventIntStatusConfig: Options = {
    multiple: true,
    tags: true,
    closeOnSelect: true,
    width: 200
  };

  public branchOfficeSelected: string[] = [];
  public branchOffices: BranchOfficeDto[] = [];
  public branchOfficesData: Array<Select2OptionData>;
  public branchOfficesConfig: Options = {
    multiple: true,
    tags: true,
    closeOnSelect: true,
    width: 200
  };

  public displayedColumns: string[] = [
    'check',
    'event',
    'keyBodega',
    'keySource',
    'codigoUnico',
    'tipoEventoIntegracion',
    'fechaUltimoEnvio',
    'estadoDesc',
    'fechaCreacion'
  ];

  @ViewChild('inputCriteria') inputCriteria: ElementRef;

  constructor(
    private _toastr: ToastrService,
    public router: Router,
    public datePipe: DatePipe,
    public _modalService: NgbModal,
    private _sessionService: SessionProvider,
    public _serviceLocation: ServiceLocation,
    private _mainService: EventIntegrationService
  ) {
    super(_modalService);
    this._dataSource = new EventIntDataSource(this._mainService);
    let now = new Date();
    this.startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    this.endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    this.loadEvenIntTypes();
    this.loadEvenIntStatus();
    this.loadBranchOffices();
  }

  ngOnInit(): void {
    this.inicializador();
  }

  clearEventIntTypes() {
    this.eventIntTypesSelected = [];
  }

  clearEventIntStatus() {
    this.eventIntStatusSelected = [];
  }

  selectAllEventIntStatus() {
    this.eventIntStatusSelected = [];
    for (let index = 0; index < this.eventIntStatus.length; index++) {
      const element = this.eventIntStatus[index];
      this.eventIntStatusSelected.push(element.id.toString());
    }
  }

  selectAllEventIntTypes() {
    this.eventIntTypesSelected = [];
    for (let index = 0; index < this.eventIntTypes.length; index++) {
      const element = this.eventIntTypes[index];
      this.eventIntTypesSelected.push(element.id.toString());
    }
  }

  loadEvenIntStatus() {
    this._mainService.getStatus().then((items: IEventIntStatusDto[]) => {
      this.eventIntStatus = items;
      this.eventIntStatusData = [];
      for (let index = 0; index < this.eventIntStatus.length; index++) {
        const element = this.eventIntStatus[index];
        this.eventIntStatusData.push({
          id: element.id.toString(),
          text: element.nombre
        });
      }
    });
  }

  loadEvenIntTypes() {
    this._mainService.getTypes().then((items: IEventIntTypeDto[]) => {
      this.eventIntTypes = items;
      this.eventIntTypesData = [];
      for (let index = 0; index < this.eventIntTypes.length; index++) {
        const element = this.eventIntTypes[index];
        this.eventIntTypesData.push({
          id: element.id.toString(),
          text: element.nombre
        });
      }
    });
  }

  clearBranchOffices() {
    this.branchOfficeSelected = [];
  }

  selectAllBranchOffices() {
    this.branchOfficeSelected = [];
    for (let index = 0; index < this.branchOffices.length; index++) {
      const element = this.branchOffices[index];
      this.branchOfficeSelected.push(this.buildBrancOfficeId(element.noCia, element.keyBodega, element.puntoVentaId));
    }
  }

  loadBranchOffices() {
    this._serviceLocation.get().then((items: BranchOfficeDto[]) => {
      this.branchOffices = items;
      this.branchOfficesData = [];
      for (let index = 0; index < this.branchOffices.length; index++) {
        const element = this.branchOffices[index];
        this.branchOfficesData.push({
          id: this.buildBrancOfficeId(element.noCia, element.keyBodega, element.puntoVentaId),
          text: this.buildBrancOfficeName(element.keyBodega, element.puntoVentaId, element.nombre)
        });
      }
    });
  }

  buildBrancOfficeId(noCia: string, keyBodega: string, puntoVentaId: number) {
    return keyBodega;
  }

  buildBrancOfficeName(keyBodega: string, puntoVentaId: number, nombre: string) {
    return `${keyBodega} ${nombre}`;
  }

  ngAfterViewInit(): void {
    this.fromEvent(this.inputCriteria.nativeElement);

    merge(this.paginator.page)
      .pipe(
        tap(() => this.filter())
      ).subscribe();
  }

  fromEvent(nativeElement: ElementRef): void {
    fromEvent(nativeElement.nativeElement, 'keyup')
      .pipe(
        debounceTime(150),
        distinctUntilChanged(),
        tap(() => {
          this.paginator.pageIndex = 0;
          this.filter();
        })
      ).subscribe();
  }

  public search(): void {
    this.paginator.pageIndex = 0;
    this.filter();
  }

  public filter(): void {
    this._dataSource.load(
      this.paginator.pageIndex,
      this.paginator.pageSize,
      {
        startDate: this.datePipe.transform(this.startDate, 'yyyy-MM-dd'),
        endDate: this.datePipe.transform(this.endDate, 'yyyy-MM-dd'),
        criteria: this.inputCriteria.nativeElement.value,
        branchOfficeIds: this.branchOfficeSelected,
        ids: [],
        states: this.eventIntStatusSelected,
        types: this.eventIntTypesSelected
      });
  }

  public changeStartDate(param: any): void {
    this.paginator.pageIndex = 0;
  }

  public changeEndDate(param: any): void {
    this.paginator.pageIndex = 0;
  }

  resetearSeleccionados() {
    const selected = this.getCheckBoxChecked();
    if (selected && selected.length > 0) {
      Utils.confirm(
        '¿Desea reenviar los eventos seleccionados?',
        () => {
          this._mainService.reset(selected).then((result: ISimpleEventIntDto[]) => {
            this._dataSource.merge(result);
            this._toastr.success('Se realizó el reenvio con éxito.', 'Confirmación');
          });
        }
      );
    }
  }

  resetear(id: number) {
    Utils.confirm(
      '¿Desea reenviar el evento seleccionado?',
      () => {
        this._mainService.reset([id]).then((result: ISimpleEventIntDto[]) => {
          this._dataSource.merge(result);
          this._toastr.success('Se realizó el reenvio con éxito.', 'Confirmación');
        });
      }
    );
  }

  ver(id: number) {
    this._mainService.filter({
      pageIndex: 0,
      pageSize: 1,
      param: {
        ids: [
          id
        ]
      }
    }).then((result: ResultPage<IEventIntDto>) => {
      if (result.elements && result.elements.length > 0) {
        const modalRef = this._modalService.open(ShoweventintComponent, {
          windowClass: 'animated slideInUp',
          size: 'lg'
        });
        modalRef.componentInstance.dato = result.elements[0].dato;
      }
    });
  }

  checkAllCheckBox(ev) {
    if (this._dataSource.resultPage && this._dataSource.resultPage.elements) {
      this._dataSource.resultPage.elements.forEach(x => {
        x.bSelected = ev.target.checked;
      });
    }
  }

  checkCheckBox(ev, element: ISimpleEventIntDto) {
    element.bSelected = ev.target.checked;
  }

  getCheckBoxChecked(): number[] {
    if (this._dataSource.resultPage && this._dataSource.resultPage.elements) {
      return new List<ISimpleEventIntDto>(this._dataSource.resultPage.elements)
        .Where(x => x.bSelected === true)
        .Select(x => x.id).ToArray();
    }
    return [];
  }

  isAllCheckBoxChecked() {
    if (this._dataSource.resultPage && this._dataSource.resultPage.elements) {
      const response = this._dataSource.resultPage.elements.every(p => {
        return p.bSelected;
      });
      return response;
    }
    return false;
  }
}
