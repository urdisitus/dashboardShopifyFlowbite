import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { Component, OnInit, Inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { MarketplacesItemMatchCodeService } from 'src/app/services/marketplaces/marketplaces.service';
import { IMarketplaceCompany, IMarketplaceItemMatchCode, IMarketplaceStoreItemMatchCode } from 'src/app/models/markeplaces.models';

@Component({
  selector: 'app-item-match-code-form',
  templateUrl: './item_match_code_form.component.html',
  styleUrls: ['./item_match_code_form.component.css']
})
export class ItemMatchCodeFormComponent implements OnInit {
  element: IMarketplaceStoreItemMatchCode;
  json: Object;
  companies : IMarketplaceCompany[] = [];

  public form: FormGroup;

  constructor(
    public fb: FormBuilder,
    public dialogRef: MatDialogRef<ItemMatchCodeFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IMarketplaceItemMatchCode,
    public service: MarketplacesItemMatchCodeService,
    public toastr: ToastrService) {
    this.element = data;
  }

  ngOnInit(): void {
    this.service.getCompanies().then((result: IMarketplaceCompany[]) => {
      this.companies = result;
    });
    this.form = new FormGroup({
      code: new FormControl(this.element.code, [
        Validators.required,
        Validators.maxLength(100)]),
      extCode: new FormControl(this.element.extCode, [
        Validators.required,
        Validators.maxLength(15)]),
      companyId: new FormControl(this.element.companyId, [
        Validators.required,
        Validators.maxLength(100)])
    });
  }

  store() {
    if (this.form.valid) {
      const param: IMarketplaceStoreItemMatchCode = {
        id: this.element.id,
        code: this.code.value,
        companyId: this.companyId.value,
        extCode: this.extCode.value
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

  get code() { return this.form.get('code'); }
  get extCode() { return this.form.get('extCode'); }
  get companyId() { return this.form.get('companyId'); }
}
