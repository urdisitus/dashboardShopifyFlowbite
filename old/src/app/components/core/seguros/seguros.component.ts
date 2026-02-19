import { Component, OnInit } from '@angular/core';
import { ApiSeguroService } from '../../../services/core/seguro/seguro.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { SessionProvider } from '../../../providers/session/session.provider';
import { DatatableBase } from '../../generic/component/datatable.base';
import { ListarVentaSeguroResult } from '../../../dataTransferObjects/seguro/seguro';
import { MatTableDataSource } from '@angular/material/table';
import { FormGroup, FormControl, Validators, ValidatorFn } from '@angular/forms';
import { List } from 'linqts';
import { DocumentService } from '../../../services/core/docs/document.service';
import { IDocumentVersionDto } from '../../../dataTransferObjects/docs/documentdto';

@Component({
  selector: 'app-seguros',
  templateUrl: './seguros.component.html',
  styleUrls: ['./seguros.component.css']
})
export class SegurosComponent extends DatatableBase<ListarVentaSeguroResult> implements OnInit {
  public displayedColumns: string[] = ['fecha', 'opcion', 'urlreceta', 'vendedor', 'codigoUnico', 'cliente', 'montoCobertura'];
  public idCampana: number = undefined;
  public fechaInicial: Date;
  public fechaFinal: Date;
  public data: ListarVentaSeguroResult[];
  public userInfo: IUserInfo;
  public currentElement: ListarVentaSeguroResult;

  public formSeguro: FormGroup;
  public referenceModalSeguro: any;
  public verDocumentoModal: any;

  constructor(
    private _apiSeguroService: ApiSeguroService,
    private _docService: DocumentService,
    public _modalService: NgbModal,
    private _toastr: ToastrService,
    public router: Router,
    private _sesionUser: SessionProvider) {

    super(_modalService);

  }

  public ngOnInit(): void {
    this.inicializador();

    this._sesionUser.getUserInfo().then((userInfo: IUserInfo) => {
      this.userInfo = userInfo;
      if (this.userInfo === undefined || this.userInfo === null) {
        this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
      }
    });
    this.fechaInicial = new Date();
    this.fechaFinal = new Date();
    this.listarVentasSeguro(this.fechaInicial, this.fechaFinal);

    this.setValidateFormSeguro();
  }

  private listarVentasSeguro(fechaIni: Date, fechaFin: Date): void {
    this._apiSeguroService.ListarVentasSeguro({ starDate: fechaIni, endDate: fechaFin })
      .then(
        (result) => {
          this.data = result;
          this.dataSource = new MatTableDataSource<ListarVentaSeguroResult>(this.data);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.obtenerDocuments();
        }
      );
  }

  private obtenerDocuments() {
    if (this.data && this.data.length > 0) {
      const dataList = new List<ListarVentaSeguroResult>(this.data);
      this._docService.getByExtCodes(dataList.Select(x => x.codigoUnico).ToArray()).then((result: IDocumentVersionDto[]) => {
        const resultList = new List<IDocumentVersionDto>(result);
        dataList.Join<IDocumentVersionDto>(resultList, x => x.codigoUnico, y => y.sExtCode, (venta: ListarVentaSeguroResult, documento: IDocumentVersionDto) => {
          if (venta && documento) {
            venta.urlReceta = documento.sSourceDir;
          }
        });
      });
    }
  }

  public changeDate(param: any): void {
    this.actualizarData();
  }

  public actualizarData(): void {
    this.listarVentasSeguro(this.fechaInicial, this.fechaFinal);
  }

  public guardarReceta(): void {
    const formData = this.prepareSave();
    this._docService.store(formData).then((result: IDocumentVersionDto) => {
      this.referenceModalSeguro.close();
      this._toastr.success('El registro se completó con éxito', 'Receta asegurado', {
        progressAnimation: 'decreasing',
        timeOut: 3000
      });
      const dataList = new List<ListarVentaSeguroResult>(this.data);
      const resultList = new List<IDocumentVersionDto>([result]);
      dataList.Join<IDocumentVersionDto>(resultList, x => x.codigoUnico, y => y.sExtCode, (venta: ListarVentaSeguroResult, documento: IDocumentVersionDto) => {
        if (venta && documento) {
          venta.urlReceta = documento.sSourceDir;
        }
      });
    });
  }

  private prepareSave(): FormData {
    const formData = new FormData();
    formData.append('File', this.formSeguro.get('File').value);
    formData.append('NoCia', this.currentElement.noCia);
    formData.append('ExtCode', this.currentElement.codigoUnico);
    formData.append('DocumentTypeId', '1');
    formData.append('UserDomain', this.userInfo.userName);
    formData.append('UserId', this.userInfo.userId.toString());
    formData.append('InfoExtra', JSON.stringify({ NoCia: this.currentElement.noCia, CodigoUnico: this.currentElement.codigoUnico, Bodega: this.currentElement.bodega, Caja: 1, KeyOrigen: this.currentElement.origen, KeyOrigenApp: "XSTORE" }));
    return formData;
  }

  public showForm(content: any, element: ListarVentaSeguroResult): void {
    this.currentElement = element;
    this.cleanForm();
    this.referenceModalSeguro = this._modalService.open(content, { windowClass: 'animated slideInUp' });
  }

  public showDocument(content: any, element: ListarVentaSeguroResult): void {
    this.currentElement = element;
    this.verDocumentoModal = this._modalService.open(content, { windowClass: 'animated slideInUp', size: 'lg' });
  }

  public cleanForm(): void {
    this.formSeguro.get('File').setValue('');
    this.formSeguro.reset();
  }

  private setValidateFormSeguro(): void {
    this.formSeguro = new FormGroup({
      File: new FormControl('', [
        Validators.required
      ])
    });
  }

  public onFileChange(event: any, name: string): void {
    if (event.target.files.length > 0) {
      console.log(event.target.files);
      const file = event.target.files[0];
      this.formSeguro.get(name).setValue(file);
    }
  }
}
