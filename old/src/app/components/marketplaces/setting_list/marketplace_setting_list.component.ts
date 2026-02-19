import { SelectionModel } from "@angular/cdk/collections";
import { AfterViewInit, Component, OnInit } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { debounceTime, distinctUntilChanged, tap } from "rxjs/operators";
import { IMarketplaceSetting } from "src/app/models/markeplaces.models";
import { MarketplacesSettingService } from "src/app/services/marketplaces/marketplaces.service";
import { DatatableBase } from "../../generic/component/datatable.base";
import { MatDialog } from "@angular/material";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { merge, fromEvent } from "rxjs";
import { MarketplaceSettingListadoDataSource } from "src/app/services/marketplaces/marketplace_setting.datasource";
import { MarketplaceSettingFormComponent } from "../setting_form/marketplace_setting_form.component";

@Component({
  selector: 'app-marketplace-setting-list',
  templateUrl: './marketplace_setting_list.component.html',
  styleUrls: ['./marketplace_setting_list.component.css']
})
export class MarketplaceSettingListComponent extends DatatableBase<IMarketplaceSetting> implements OnInit, AfterViewInit {
  public form = new FormGroup({    
    key: new FormControl(null),
    criteria: new FormControl(null),
    status: new FormControl(null),
  });
  public displayedColumns: string[] = ['key', 'value', 'createDate', 'editDate', 'actions'];
  public selection = new SelectionModel<IMarketplaceSetting>(true, []);
  public initialSize: number = 20;
  public source: MarketplaceSettingListadoDataSource;

  constructor(
    private api: MarketplacesSettingService,
    public dialog: MatDialog,
    public _modalService: NgbModal) {
    super(_modalService);
    this.source = new MarketplaceSettingListadoDataSource(api);
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
          this.selection.clear();
          this.search();
        })
      ).subscribe();
  }

  ngAfterViewInit(): void {
    merge(this.paginator.page)
      .pipe(
        tap(() => this.search())
      ).subscribe();
    this.search();
  }

  search() {
    this.source.loadListado({
      param: {
        key: this.form.get('key').value,
        criteria: this.form.get('criteria').value,        
        status: this.form.get('status').value,
      },
      start: this.paginator.pageIndex * this.paginator.pageSize,
      length: this.paginator.pageSize
    });
  }

  showForm(item: IMarketplaceSetting) {
    const dialogRef = this.dialog.open(MarketplaceSettingFormComponent, {
      data: item,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.search();
      }
    });
  }
}
