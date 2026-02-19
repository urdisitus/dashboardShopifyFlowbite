import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiSucursalService } from '../../../services/branchOffices/sucursal.service';
import { ToastrService } from 'ngx-toastr';
import { SucursalDto } from '../../../dataTransferObjects/branchOffice/branchOffice';
@Component({
  selector: 'app-branch-offices-edit',
  templateUrl: './branch-offices-edit.component.html',
  styleUrls: ['./branch-offices-edit.component.css']
})
export class BranchOfficesEditComponent implements OnInit {

  public bodega: SucursalDto;
  constructor(
    private _apiService: ApiSucursalService,
    private _toastr: ToastrService,
    public modal: NgbActiveModal,
    private _modalService: NgbModal) {

  }

  ngOnInit() {
  }

  setData(item: SucursalDto) {
    this.bodega = item;
  }


  dismissModal() {
    this.modal.dismiss('cancel click');
  }

  guardar() {
    this._apiService.Upsert(this.bodega).then((result: SucursalDto) => {
      this._toastr.success('Se actualizo de manera exitosa.', 'Asignación de Stickers', { progressAnimation: 'decreasing', timeOut: 3000 });
      this.modal.close(result);
      this.dismissModal();
    });
  }
}

