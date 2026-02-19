import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { Component, OnInit, Inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
// Depending on whether rollup is used, moment needs to be imported differently.
// Since Moment.js doesn't have a default export, we normally need to import using the `* as`
// syntax. However, rollup creates a synthetic default module and we thus need to import it using
// the `default as` syntax.
import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import { defaultFormat as _rollupMoment } from 'moment';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material';
import { IRedeemPointGroupDto, IRedeemPointTypeDto, IStoreRedeemPointParam } from 'src/app/models/external/redeem-point/redeem-point-dto';
import { RedeemPointService } from 'src/app/services/core/preapertura/redeem-point.service';

const moment = _rollupMoment || _moment;

// See the Moment.js docs for the meaning of these formats:
// https://momentjs.com/docs/#/displaying/format/
export const MY_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
};

@Component({
  selector: 'app_redeem_point_form',
  templateUrl: './redeem-point-form.component.html',
  styleUrls: ['./redeem-point-form.component.css'],
  preserveWhitespaces: true,
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class RedeemPointFormComponent implements OnInit {
  element: IStoreRedeemPointParam;
  types: IRedeemPointTypeDto[] = [];
  groups: IRedeemPointTypeDto[] = [];

  public form: FormGroup;

  constructor(
    public fb: FormBuilder,
    public dialogRef: MatDialogRef<RedeemPointFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IStoreRedeemPointParam,
    public service: RedeemPointService,
    public toastr: ToastrService) {
    this.element = data;
  }

  ngOnInit(): void {
    this.service.types().then((result: IRedeemPointTypeDto[]) => {
      this.types = result;
    });
    this.service.groups().then((result: IRedeemPointGroupDto[]) => {
      this.groups = result;
    });
    this.form = new FormGroup({
      name: new FormControl(this.element.name, [
        Validators.required,
        Validators.maxLength(100)]),
      descript: new FormControl(this.element.descript, [
        Validators.maxLength(400)]),
      startDate: new FormControl(this.element.startDate),
      endDate: new FormControl(this.element.endDate),
      factor: new FormControl(this.element.factor),
      value: new FormControl(this.element.value),
      minimalAmonunt: new FormControl(this.element.minimalAmonunt),
      redeemPointGroupId: new FormControl(this.element.redeemPointGroupId),
      redeemPointTypeId: new FormControl(this.element.redeemPointTypeId)
    });      
  }

  store() {
    if (this.form.valid) {
      const param: IStoreRedeemPointParam = {
        id: this.element.id,
        name: this.name.value,
        descript: this.descript.value,
        startDate: this.startDate.value,
        endDate: this.endDate.value,
        factor: this.factor.value,
        value: this.value.value,
        minimalAmonunt: this.minimalAmonunt.value,
        redeemPointGroupId: this.redeemPointGroupId.value,
        redeemPointTypeId: this.redeemPointTypeId.value
      };
      this.service.store(param)
        .then(value => {
          this.dialogRef.close(true);
          this.toastr.success('Se ha guardado el elemento correctamente');
        })
    }
  }

  close() {
    this.dialogRef.close(false);
  }

  get name() { return this.form.get('name'); }
  get descript() { return this.form.get('descript'); }
  get startDate() { return this.form.get('startDate'); }
  get endDate() { return this.form.get('endDate'); }
  get factor() { return this.form.get('factor'); }
  get value() { return this.form.get('value'); }
  get minimalAmonunt() { return this.form.get('minimalAmonunt'); }
  get redeemPointGroupId() { return this.form.get('redeemPointGroupId'); }
  get redeemPointTypeId() { return this.form.get('redeemPointTypeId'); }
}
