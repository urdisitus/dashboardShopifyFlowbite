import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportVentaDevolucionComponent } from './report-venta-devolucion.component';

describe('ReportVentaDevolucionComponent', () => {
  let component: ReportVentaDevolucionComponent;
  let fixture: ComponentFixture<ReportVentaDevolucionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportVentaDevolucionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportVentaDevolucionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
