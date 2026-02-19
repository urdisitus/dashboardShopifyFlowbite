import { Component, OnInit, Input, Output } from '@angular/core';
import { PreaperturaResult, PreaperturaCartillaResult } from 'src/app/dataTransferObjects/preapertura/preapertura';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-reconteo',
  templateUrl: './reconteo.component.html',
  styleUrls: ['./reconteo.component.css']
})
export class ReconteoComponent {

  @Input()
  public idPreapertura: number;

  @Output()
  public cantidadReconteo: number;
  
  @Input()
  public cantCanje: Array<PreaperturaCartillaResult>;

  constructor(public modal: NgbActiveModal) {
  }

}
