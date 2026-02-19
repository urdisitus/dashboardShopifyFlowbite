import { NgBlockUI, BlockUI } from 'ng-block-ui';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { ISearchableService } from '../ISearchableService';

export class SearchableService<TEntity> {

  @BlockUI() blockUI: NgBlockUI;
  //Datatable  
  public dtElement: DataTableDirective;
  public dtOptions: any = {};
  public dtTrigger: Subject<TEntity> = new Subject();
  public items: TEntity[] = [];

  constructor(
    private service: ISearchableService<TEntity>,
    private paramProvider: () => any = null) {

  }

  private getParams() {
    return this.paramProvider != null ? this.paramProvider() : null;
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
    };
    this.search(this.getParams());
  }

  rerender(dtInstancePromise: Promise<DataTables.Api>): void {
    if (dtInstancePromise) {
      dtInstancePromise.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy();
        this.dtTrigger.next();
      });
    }
  }

  search(param: any): Promise<TEntity[]> {
    return new Promise<TEntity[]>((resolve, error) => {
      this.blockUI.start('Obteniendo registros...'); // Start blocking
      return this.service.search(param).then((items: TEntity[]) => {
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
