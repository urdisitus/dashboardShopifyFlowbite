import { DomSanitizer } from '@angular/platform-browser';
import { FormControl } from '@angular/forms';
import { IRemoteStringDto } from './../../../dataTransferObjects/remote-string/remote-string-dto';
import { RemoteStringService } from './../../../services/core/remoteString/remote-string-Stores';
import { RemoteStringStoreComponent } from './../../remote-string/remote-string-store/remote-string-store.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatTable } from '@angular/material';
import 'rxjs/Rx';

@Component({
  selector: 'app-remote-string-list',
  templateUrl: './remote-string-list.component.html',
  styleUrls: ['./remote-string-list.component.css']
})
export class RemoteStringListComponent implements OnInit {
  displayedColumns: string[] = ['application', 'namespace', 'key', 'value', 'action'];
  dataSource: IRemoteStringDto[] = [];
  applications: string[] = [];
  namespaces: string[] = [];
  application: string = '';
  namespace: string = null;
  downloadJsonHref;
  downloadJsonName;
  criteriaControl = new FormControl();
  private setting = {
    element: {
      dynamicDownload: null as HTMLElement
    }
  }

  @ViewChild(MatTable) table: MatTable<IRemoteStringDto>;

  constructor(
    public dialog: MatDialog,
    private sanitizer: DomSanitizer,
    public remoteStringService: RemoteStringService) { }

  onApplicationChange($event) {
    this.loadNamespaces();
  }

  openDialog(action, obj: IRemoteStringDto) {
    obj['action'] = action;
    if (!obj.application) {
      obj.application = this.application;
    }
    const dialogRef = this.dialog.open(RemoteStringStoreComponent, {
      width: '350px',
      data: {
        data: obj
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.event == 'Nuevo') {
        this.storeData(result.data);
      } else if (result.event == 'Editar') {
        this.storeData(result.data);
      }
    });
  }

  storeData(row_obj: IRemoteStringDto) {
    this.remoteStringService.stores({
      application: row_obj.application,
      detail: [
        {
          key: row_obj.key,
          locale: null,
          namespace: row_obj.namespace,
          value: row_obj.value
        }
      ],
      user: 'admin'
    }).then((list: IRemoteStringDto[]) => {
      let exists = false;
      this.dataSource = this.dataSource.filter((value, key) => {
        if (value.key == row_obj.key
          && value.namespace == row_obj.namespace
          && value.locale == row_obj.locale
          && value.application == row_obj.application) {
          value.value = row_obj.value;
          exists = true;
        }
        return true;
      });
      if (!exists) {
        this.dataSource.push(row_obj);
        this.table.renderRows();
      }
    });
  }

  dynamicDownloadJson() {
    this.remoteStringService.list({
      application: this.application
    }).then((list: IRemoteStringDto[]) => {
      const jsonArray: any[] = [];
      list = list.filter((value, key) => {
        jsonArray.push({
          n: value.namespace,
          l: value.locale,
          k: value.key,
          v: value.value
        });
      });
      this.downloadFile(JSON.stringify(jsonArray))
      // this.dyanmicDownloadByHtmlTag({
      //   fileName: this.application + '.json',
      //   text: JSON.stringify(jsonArray)
      // });
    });
  }

  private dyanmicDownloadByHtmlTag(arg: {
    fileName: string,
    text: string
  }) {
    if (!this.setting.element.dynamicDownload) {
      this.setting.element.dynamicDownload = document.createElement('a');
    }
    const element = this.setting.element.dynamicDownload;
    const fileType = arg.fileName.indexOf('.json') > -1 ? 'text/json' : 'text/plain';
    element.setAttribute('href', `data:${fileType};charset=utf-8,${encodeURIComponent(arg.text)}`);
    element.setAttribute('target', '_blank');
    element.setAttribute('download', arg.fileName);

    var event = new MouseEvent("click");
    element.dispatchEvent(event);
  }

  list() {
    this.remoteStringService.list({
      application: this.application,
      namespace: this.namespace,
      criteria: this.criteriaControl.value
    }).then((list: IRemoteStringDto[]) => {
      this.dataSource = list;
      this.table.renderRows();
      if (this.application) {
        const jsonArray: any[] = [];
        list.filter((value, key) => {
          jsonArray.push({
            n: value.namespace,
            l: value.locale,
            k: value.key,
            v: value.value
          });
        });
        this.downloadJsonName = this.application + '.json';
        var uri = this.sanitizer.bypassSecurityTrustUrl("data:text/json;charset=UTF-8," + encodeURIComponent(JSON.stringify(jsonArray)));
        this.downloadJsonHref = uri;
      }
    });
  }

  ngOnInit() {
    this.remoteStringService.applist()
      .then((list: string[]) => {
        this.applications = list;
      });
    this.loadNamespaces();
  }

  loadNamespaces() {
    this.remoteStringService.namespaceList(this.application)
      .then((list: string[]) => {
        this.namespaces = list;
      });
  }

  downloadFile(data: string) {
    const blob = new Blob([data], { type: 'text/json' });
    const url = window.URL.createObjectURL(blob);
    window.open(url);
  }
}
