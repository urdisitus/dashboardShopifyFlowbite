import { RemoteStringService } from './../../../services/core/remoteString/remote-string-Stores';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { IRemoteStringDto } from './../../../dataTransferObjects/remote-string/remote-string-dto';
import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-remote-string-store',
  templateUrl: './remote-string-store.component.html',
  styleUrls: ['./remote-string-store.component.css']
})
export class RemoteStringStoreComponent implements OnInit {

  action: string;
  local_data: any;
  canEditKeys: boolean;
  canEditApplication: boolean;
  applications: string[] = [];
  namespaces: string[] = [];
  filteredOptions: Observable<string[]>;
  filteredOptionsName: Observable<string[]>;
  appControl = new FormControl();
  nameControl = new FormControl();

  constructor(
    public dialogRef: MatDialogRef<RemoteStringStoreComponent>,
    public remoteStringService: RemoteStringService,
    @Optional() @Inject(MAT_DIALOG_DATA) public dataD: any) {
    const data: IRemoteStringDto = dataD.data;
    this.canEditKeys = !!data.key;
    this.canEditApplication = !!data.application;
    this.local_data = { ...data };
    this.action = this.local_data.action;
    if (this.canEditApplication) {
      this.appControl.disable();
    } else {
      this.appControl.enable();
    }
    if (this.canEditKeys) {
      this.nameControl.disable();
    } else {
      this.nameControl.enable();
    }
  }

  doAction() {
    this.dialogRef.close({ event: this.action, data: this.local_data });
  }

  closeDialog() {
    this.dialogRef.close({ event: 'Cancel' });
  }

  ngOnInit() {
    this.filteredOptions = this.appControl.valueChanges
      .pipe(
        startWith<string | string>(''),
        map(value => typeof value === 'string' ? value : value),
        map(app => app ? this._filterApplication(app + '') : this.applications.slice())
      );
    this.filteredOptionsName = this.nameControl.valueChanges
      .pipe(
        startWith<string | string>(''),
        map(value => typeof value === 'string' ? value : value),
        map(name => name ? this._filterNamespace(name + '') : this.namespaces.slice())
      );
    this.remoteStringService.applist()
      .then((list: string[]) => {
        this.applications = list;
      });
    this.loadNamespaces();
  }

  loadNamespaces() {
    this.remoteStringService.namespaceList(this.appControl.value)
      .then((list: string[]) => {
        this.namespaces = list;
      });
  }

  displayFnApplication(app?: string): string | undefined {
    return app ? app : undefined;
  }

  private _filterApplication(app: string): string[] {
    const filterValue = app.toLowerCase();
    return this.applications.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  }


  displayFnNamespace(name?: string): string | undefined {
    return name ? name : undefined;
  }

  private _filterNamespace(name: string): string[] {
    const filterValue = name.toLowerCase();
    return this.namespaces.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  }
}
