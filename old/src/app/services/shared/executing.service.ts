import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export class ExecutingService {

  public isLoading = new Subject<boolean>();

  public show(): void {
    this.isLoading.next(true);
  }

  public hide(): void {
    setTimeout(()=>{ this.isLoading.next(false); }, 1000);       
  }
}
