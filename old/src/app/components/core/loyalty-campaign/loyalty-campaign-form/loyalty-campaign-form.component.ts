import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { Component, OnInit, Inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ILoyaltyCampaignRuleTypeDto, IStoreLoyaltyCampaignParam, IStoreLoyaltyCampaignRuleParam } from 'src/app/models/external/loyalty-campaign/loyalty-campaign-dto';
import { LoyaltyCampaignService } from 'src/app/services/core/preapertura/loyalty-campaign.service';

// Depending on whether rollup is used, moment needs to be imported differently.
// Since Moment.js doesn't have a default export, we normally need to import using the `* as`
// syntax. However, rollup creates a synthetic default module and we thus need to import it using
// the `default as` syntax.
import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import { defaultFormat as _rollupMoment } from 'moment';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatTableDataSource } from '@angular/material';
import { ServiceTurno } from 'src/app/services/external/arqueo/turno.service';
import { PagoTipoItem } from 'src/app/models/external/arqueo/PagoTipoResult';

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
  selector: 'app_loyalty_campaign_form',
  templateUrl: './loyalty-campaign-form.component.html',
  styleUrls: ['./loyalty-campaign-form.component.css'],
  preserveWhitespaces: true,
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class LoyaltyCampaignFormComponent implements OnInit {
  displayedColumns: string[] = ['loyaltyCampaignRuleTypeId', 'value', 'action'];
  dataSource = new MatTableDataSource<any>();
  element: IStoreLoyaltyCampaignParam;
  ruleTypes: ILoyaltyCampaignRuleTypeDto[] = [];
  pagosTipo: PagoTipoItem[] = [];

  public form: FormGroup;

  constructor(
    public fb: FormBuilder,
    public dialogRef: MatDialogRef<LoyaltyCampaignFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IStoreLoyaltyCampaignParam,
    public serviceTurno: ServiceTurno,
    public service: LoyaltyCampaignService,
    public toastr: ToastrService) {
    this.element = data;
  }

  ngOnInit(): void {
    this.service.ruleTypes().then((result: ILoyaltyCampaignRuleTypeDto[]) => {
      this.ruleTypes = result;
    });
    this.serviceTurno.tipoPago().then((result: PagoTipoItem[]) => {
      result.forEach(element => {
        if(!this.pagosTipo.find(x=> x.descripcion == element.descripcion)){
          this.pagosTipo.push({
            descripcion : element.descripcion,
            generaVoucher : element.generaVoucher,
            id : element.id,
            keySin : element.keySin,
            monto : 0,
            xStoreTenderId: element.descripcion          
          });
        }
      });      
      result.forEach(element => {
        if(!this.pagosTipo.find(x=> x.descripcion == element.xStoreTenderId)){
          this.pagosTipo.push({
            descripcion : element.xStoreTenderId,
            generaVoucher : element.generaVoucher,
            id : element.id,
            keySin : element.keySin,
            monto : 0,
            xStoreTenderId: element.xStoreTenderId          
          });
        }
      });      
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
      loyaltyCampaignRule: this.fb.array((this.element.loyaltyCampaignRule ? this.element.loyaltyCampaignRule : []).map(val => this.loadVOForm(val))),
    });
    const control = this.loyaltyCampaignRule as FormArray;
    this.dataSource = new MatTableDataSource(control.controls);
  }

  AddNewRow() {
    const control = this.loyaltyCampaignRule as FormArray;
    control.push(this.initiateVOForm());
    this.dataSource = new MatTableDataSource(control.controls)
  }

  DeleteSVO(i: number) {
    const control = this.loyaltyCampaignRule as FormArray;
    control.removeAt(i);
    this.dataSource = new MatTableDataSource(control.controls)
  }

  initiateVOForm(): FormGroup {
    return this.fb.group({
      loyaltyCampaignRuleTypeId: new FormControl(this.ruleTypes.length > 0 ? this.ruleTypes[0].id : null, [
        Validators.required
      ]),
      value: new FormControl(null)
    });
  }

  loadVOForm(val: IStoreLoyaltyCampaignRuleParam): FormGroup {
    return this.fb.group({
      loyaltyCampaignRuleTypeId: new FormControl(val.loyaltyCampaignRuleTypeId, [
        Validators.required
      ]),
      value: new FormControl(val.value)
    });
  }

  store() {
    if (this.form.valid) {
      const param: IStoreLoyaltyCampaignParam = {
        id: this.element.id,
        name: this.name.value,
        descript: this.descript.value,
        startDate: this.startDate.value,
        endDate: this.endDate.value,
        factor: this.factor.value,
        loyaltyCampaignRule: this.loyaltyCampaignRule.value
      };
      if(param.loyaltyCampaignRule){
        param.loyaltyCampaignRule.forEach(x=> x.descript = this.pagosTipo.find(y=> y.descripcion == x.value).xStoreTenderId)
      }
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
  get loyaltyCampaignRule() { return this.form.get('loyaltyCampaignRule'); }

  get loyaltyCampaignRuleLength() { return (this.loyaltyCampaignRule as FormArray).length; }

  loyaltyCampaignRuleTypeId(i: number) { return (this.loyaltyCampaignRule as FormArray).controls[i].get('loyaltyCampaignRuleTypeId'); }
}
