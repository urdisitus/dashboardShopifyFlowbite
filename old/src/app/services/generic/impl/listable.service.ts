import { NgBlockUI, BlockUI } from 'ng-block-ui';
import { IListableService } from '../IListableService';
import { Subject } from 'rxjs';

export class ListableService<TEntity> {

  @BlockUI() blockUI: NgBlockUI;
  //Datatable
  public dtOptions: any = {};
  public dtTrigger: Subject<TEntity> = new Subject();
  public items: TEntity[] = [];
  public exportColumns = [];

  constructor(
    private service: IListableService<TEntity>) {

  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  ngOnInit(): void {
    this.dtOptions = {
      responsive: true,
      pagingType: 'full_numbers',
      pageLength: 10,
      language: {
        search: "Buscar:",
        infoEmpty: "Mostrando desde 0 hasta 0 de 0 registros",
        emptyTable: "No hay datos para mostrar.",
        info: "Mostrando desde _START_ hasta _END_ de _TOTAL_ registros",
        infoFiltered: "(filstrados de _MAX_ total de registros)",
        lengthMenu: "Mostrar _MENU_ registros",
        zeroRecords: "No hay registros que coincidan con el criterio.",
        paginate: {
          first: "Primero",
          last: "Último",
          next: "Siguiente",
          previous: "Anterior"
        },
      }
      //,
      // // Declare the use of the extension in the dom parameter
      // dom: 'Bfrtip',
      // // Configure the buttons
      // buttons: [
      //   {
      //     extend: 'copy',
      //     text: '<i class="ei-copy pdd-right-5"></i><span>Copiar</span>',
      //     className: 'btn btn-default btn-rounded',
      //     exportOptions: {
      //       columns: ':not(.notexport)'
      //     },
      //     init: function (api, node, config) {
      //       $(node).removeClass('dt-button');
      //       $(node).removeClass('buttons-copy');
      //     }
      //   },
      //   {
      //     extend: 'print',
      //     text: '<i class="ti-printer pdd-right-5"></i><span>Imprimir</span>',
      //     className: 'btn btn-info btn-rounded',
      //     exportOptions: {
      //       columns: ':not(.notexport)'
      //     },
      //     init: function (api, node, config) {
      //       $(node).removeClass('dt-button');
      //       $(node).removeClass('buttons-print');
      //     }
      //   },
      //   {
      //     extend: 'excel',
      //     text: '<i class="ei-file-excel pdd-right-5"></i><span>Excel</span>',
      //     className: 'btn btn-success btn-rounded',
      //     exportOptions: {
      //       columns: ':not(.notexport)'
      //     },
      //     init: function (api, node, config) {
      //       $(node).removeClass('dt-button');
      //       $(node).removeClass('buttons-excel');
      //     }
      //   }
      // ]
    };
    this.listAll();
  }

  rerender(dtInstancePromise: Promise<DataTables.Api>): void {
    dtInstancePromise.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.dtTrigger.next();
    });
  }

  listAll(): Promise<TEntity[]> {
    return new Promise<TEntity[]>((resolve, error) => {
      this.blockUI.start('Obteniendo registros...'); // Start blocking
      return this.service.listAll().then((items: TEntity[]) => {
        this.items = items;
        this.blockUI.stop(); // Stop blocking              
        resolve(items);
      }).catch(reason => {
        this.items = [];
        this.blockUI.stop(); // Stop blocking        
        error(reason);
      });
    });
  }
}
