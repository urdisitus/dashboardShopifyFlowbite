import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IEventIntDto } from 'src/app/dataTransferObjects/monitor/eventint/event.int.dto';

@Component({
  selector: 'app-showeventint',
  templateUrl: './showeventint.component.html',
  styleUrls: ['./showeventint.component.css']
})
export class ShoweventintComponent implements OnInit {

  @ViewChild('content') content: any;
  public dato: any;

  constructor(
    public modal: NgbActiveModal,
    private _modalService: NgbModal) { }

  ngOnInit() {
  }
}
