import { Component, OnInit } from '@angular/core';
import { Subject, combineLatest, timer, BehaviorSubject } from 'rxjs';
import { ExecutingService } from 'src/app/services/shared/executing.service';
import { map, finalize } from 'rxjs/operators';

@Component({
  selector: 'app-executing',
  templateUrl: './executing.component.html',
  styleUrls: ['./executing.component.css']
})
export class ExecutingComponent{

  public color: string = 'primary';
  public mode: string = 'indeterminate';
  public value: number = 50;

  public isLoading: Subject<boolean> = this._executingService.isLoading;

  constructor(private _executingService: ExecutingService) {
  }
}
