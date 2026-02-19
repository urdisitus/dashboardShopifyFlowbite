import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportVentaSeguroComponent } from './report-venta-seguro.component';

describe('ReportVentaSeguroComponent', () => {
  let component: ReportVentaSeguroComponent;
  let fixture: ComponentFixture<ReportVentaSeguroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportVentaSeguroComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportVentaSeguroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
