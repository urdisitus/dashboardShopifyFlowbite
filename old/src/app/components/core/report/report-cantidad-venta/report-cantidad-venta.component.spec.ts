import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportCantidadVentaComponent } from './report-cantidad-venta.component';

describe('ReportCantidadVentaComponent', () => {
  let component: ReportCantidadVentaComponent;
  let fixture: ComponentFixture<ReportCantidadVentaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportCantidadVentaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportCantidadVentaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
