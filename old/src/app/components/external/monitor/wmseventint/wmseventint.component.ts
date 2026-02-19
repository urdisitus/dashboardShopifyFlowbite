import { DatePipe } from "@angular/common";
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from "@angular/core";
import { Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { List } from "linqts";
import { ToastrService } from "ngx-toastr";
import { fromEvent, merge } from "rxjs";
import { debounceTime, distinctUntilChanged, tap } from "rxjs/operators";
import { DatatableBase } from "src/app/components/generic/component/datatable.base";
import { IEventSearchGeneralDto } from "src/app/dataTransferObjects/monitor/eshopwms/event.search.general.dto";
import {
  IEventcodesStatusCountDto,
  IEventTypeCountDto,
} from "src/app/dataTransferObjects/monitor/eshopwms/eventcodes.status.count.dto";
import { IEventcodesTypeDto } from "src/app/dataTransferObjects/monitor/eshopwms/eventcodes.types.dto";
import { IEventstatesTypeDto } from "src/app/dataTransferObjects/monitor/eshopwms/eventstates.types.dto";
import { IInfointegraTypeDto } from "src/app/dataTransferObjects/monitor/eshopwms/infointegra.types.dto";
import { IIntegradorGeneralDto } from "src/app/dataTransferObjects/monitor/eshopwms/integrador.general.dto";
import { SessionProvider } from "src/app/providers/session/session.provider";
import { Utils } from "src/app/providers/utils";
import { EShopWmsService } from "src/app/services/core/monitor/apieshopwms/eshopems.service";
import { EventSearchGeneralDataSource } from "src/app/services/core/monitor/apieshopwms/event.search.general.datasource";
import { ErrorService } from "src/app/services/shared/error.service";
import { ShoweventintComponent } from "../showeventint/showeventint.component";

@Component({
  selector: "app-wmseventint",
  templateUrl: "./wmseventint.component.html",
  styleUrls: ["./wmseventint.component.css"],
})
export class WmseventintComponent
  extends DatatableBase<IEventSearchGeneralDto>
  implements OnInit, AfterViewInit
{
  public _dataSource: EventSearchGeneralDataSource;
  public startDate: Date;
  public endDate: Date;
  public initialSize: number = 10;

  public eventCodesTypeSelected: string;
  public eventCodesTypes: IEventcodesTypeDto[] = [];

  public eventstatesTypeSelected: string;
  public eventstatesTypes: IEventstatesTypeDto[] = [];

  public infoIntegraTypeSelected: string;
  public infoIntegraTypes: IInfointegraTypeDto[] = [];

  public integradorGenerals: IIntegradorGeneralDto[] = [];
  public eventcodesStatusCount: IEventcodesStatusCountDto[] = [];
  public eventTypeCount: IEventTypeCountDto[] = [];

  public displayedColumns: string[] = [
    "event",
    "codigo",
    "tipo",
    "idIntegrador",
    "idShopifyBusiness",
    "tipoEventCode",
    "estado",
    "dCreateDateUtcDate",
    "dOrigenDate",
    "dEnvioDate",
    "errorCodeBusiness",
  ];

  @ViewChild("inputShopifyBusiness") inputShopifyBusiness: ElementRef;

  constructor(
    private _toastr: ToastrService,
    public router: Router,
    public datePipe: DatePipe,
    public _modalService: NgbModal,
    private _mainService: EShopWmsService,
    private _errorService: ErrorService
  ) {
    super(_modalService);
    this._dataSource = new EventSearchGeneralDataSource(this._mainService);
    let now = new Date();
    this.startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    this.endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    this.loadEventCodesTypes();
    this.loadEventStatesTypes();
    this.loadInfoIntegraTypes();
    this.loadStatics();
  }

  ngOnInit(): void {
    this.inicializador();
  }

  loadStatics() {
    this.loadIntegradorGeneral(true);
    this.loadEventcodesStatusCount(true);
  }

  loadEventcodesStatusCount(loading: boolean) {
    this._mainService
      .getEventcodesStatusCount(loading)
      .then((items: IEventcodesStatusCountDto[]) => {
        this.eventcodesStatusCount = items;
        var grouped = new List<IEventcodesStatusCountDto>(items).GroupBy(
          (key: IEventcodesStatusCountDto) => key.tipoInfoId
        );
        this.eventTypeCount = [];
        for (let item in grouped) {
          const group = grouped[item];
          const gList = new List<IEventcodesStatusCountDto>(group);
          this.eventTypeCount.push({
            type: item,
            success : gList.Where(x=> x.keyEventStatus === "1").Sum(x=> x.count),
            pending : gList.Where(x=> x.keyEventStatus === "0").Sum(x=> x.count),
            error : gList.Where(x=> x.keyEventStatus === "-1").Sum(x=> x.count)
          });
        }
      });
  }

  loadIntegradorGeneral(loading: boolean) {
    this._mainService
      .getIntegradorGeneral(loading)
      .then((items: IIntegradorGeneralDto[]) => {
        this.integradorGenerals = items;
      });
  }

  loadEventCodesTypes() {
    this._mainService
      .getEventCodeTypes()
      .then((items: IEventcodesTypeDto[]) => {
        this.eventCodesTypes = [];
        this.eventCodesTypes.push({
          codigo: null,
          descripcion: "Seleccionar",
        });
        items.forEach((element) => {
          this.eventCodesTypes.push(element);
        });
      });
  }

  loadEventStatesTypes() {
    this._mainService
      .getEventStatesTypes()
      .then((items: IEventstatesTypeDto[]) => {
        this.eventstatesTypes = [];
        this.eventstatesTypes.push({
          codigo: null,
          descripcion: "Seleccionar",
        });
        items.forEach((element) => {
          this.eventstatesTypes.push(element);
        });
      });
  }

  loadInfoIntegraTypes() {
    this._mainService
      .getInfoIntegraTypes()
      .then((items: IInfointegraTypeDto[]) => {
        this.infoIntegraTypes = [];
        items.forEach((element) => {
          this.infoIntegraTypes.push(element);
        });
        if (!this.infoIntegraTypeSelected && items.length > 0) {
          this.infoIntegraTypeSelected = items[0].codigo;
        }
      });
  }

  ngAfterViewInit(): void {
    this.fromEvent(this.inputShopifyBusiness.nativeElement);

    merge(this.paginator.page)
      .pipe(tap(() => this.filter()))
      .subscribe();
  }

  fromEvent(nativeElement: ElementRef): void {
    fromEvent(nativeElement.nativeElement, "keyup")
      .pipe(
        debounceTime(150),
        distinctUntilChanged(),
        tap(() => {
          this.paginator.pageIndex = 0;
          this.filter();
        })
      )
      .subscribe();
  }

  public search(): void {
    this.paginator.pageIndex = 0;
    this.filter();
  }

  public filter(): void {
    if (this.infoIntegraTypeSelected) {
      this._dataSource.load(this.paginator.pageIndex, this.paginator.pageSize, {
        createDateStartUtc: this.datePipe.transform(
          this.startDate,
          "yyyy-MM-dd"
        ),
        createDateEndUtc: this.datePipe.transform(this.endDate, "yyyy-MM-dd"),
        textoBusqueda: null,
        keyTipo: this.infoIntegraTypeSelected,
        keyEventStatus: this.eventstatesTypeSelected,
        keyTipoEventCode: this.eventCodesTypeSelected,
        idShopifyBusiness: this.inputShopifyBusiness.nativeElement.value,
        idRegistro: null,
      });
    } else {
      this._toastr.warning("Debe seleccionar un tipo.", "Aviso");
    }
  }

  public changeStartDate(param: any): void {
    this.paginator.pageIndex = 0;
  }

  public changeEndDate(param: any): void {
    this.paginator.pageIndex = 0;
  }

  ver(element: IEventSearchGeneralDto) {
    if (element.jsonResponse && JSON.parse(element.jsonResponse)) {
      const modalRef = this._modalService.open(ShoweventintComponent, {
        windowClass: "animated slideInUp",
        size: "lg",
      });
      modalRef.componentInstance.dato = JSON.parse(element.jsonResponse);
    }
  }

  verErrorMessage(element: IEventSearchGeneralDto) {
    if (element.errorMessage) {
      this._errorService.show([
        {
          code: "error",
          message: element.errorMessage,
        },
      ]);
    }
  }

  changeState(element: IEventSearchGeneralDto, state: string) {
    Utils.confirm(
      `¿Desea confirmar el cambio de estado del registro ${element.codigo}?`,
      () =>
        this._mainService
          .changeEventStatus({
            idRegistro: element.idRegistro,
            keyEventStatus: state,
            keyTipo: element.keyTipo,
          })
          .then((item: IEventSearchGeneralDto) => {
            this._dataSource.merge([item]);
            this._toastr.success(
              "Se ha cambiado el estado del evento exitosamente!",
              "Aviso"
            );
          })
    );
  }
}
