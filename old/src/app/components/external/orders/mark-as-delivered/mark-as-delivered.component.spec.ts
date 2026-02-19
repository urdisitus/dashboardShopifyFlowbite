import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarkAsDeliveredComponent } from './mark-as-delivered.component';

describe('MarkAsDeliveredComponent', () => {
  let component: MarkAsDeliveredComponent;
  let fixture: ComponentFixture<MarkAsDeliveredComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarkAsDeliveredComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarkAsDeliveredComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
