import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportVentaAnulacionComponent } from './report-venta-anulacion.component';

describe('ReportVentaAnulacionComponent', () => {
  let component: ReportVentaAnulacionComponent;
  let fixture: ComponentFixture<ReportVentaAnulacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportVentaAnulacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportVentaAnulacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
