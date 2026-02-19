import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Component, OnInit, Inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { MarketplacesSettingService } from 'src/app/services/marketplaces/marketplaces.service';
import { IMarketplaceSetting, IMarketplaceStoreSetting } from 'src/app/models/markeplaces.models';

@Component({
  selector: 'app-marketplace-setting-form',
  templateUrl: './marketplace_setting_form.component.html',
  styleUrls: ['./marketplace_setting_form.component.css']
})
export class MarketplaceSettingFormComponent implements OnInit {
  element: IMarketplaceStoreSetting;
  json: Object;

  public form: FormGroup;

  constructor(
    public fb: FormBuilder,
    public dialogRef: MatDialogRef<MarketplaceSettingFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IMarketplaceSetting,
    public service: MarketplacesSettingService,
    public toastr: ToastrService) {
    this.element = data;
  }

  ngOnInit(): void {    
    this.form = new FormGroup({      
      key: new FormControl({
        disabled: true,
        value: this.element.key
      }, [
        Validators.required,
        Validators.maxLength(100)]),
      value: new FormControl(this.element.value, [
        Validators.required,
        Validators.maxLength(1000)])
    });
  }

  store() {
    if (this.form.valid) {
      const param: IMarketplaceStoreSetting = {
        id: this.element.id,
        key: this.key.value,        
        value: this.value.value
      };
      this.service.store(param)
        .then(value => {
          this.dialogRef.close(true);
          this.toastr.success('Se ha guardado configuración correctamente');
        })
    }
  }

  close() {
    this.dialogRef.close(false);
  }
  
  get key() { return this.form.get('key'); }
  get value() { return this.form.get('value'); }
}
