import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportVentaArqueoComponent } from './report-venta-arqueo.component';

describe('ReportVentaArqueoComponent', () => {
  let component: ReportVentaArqueoComponent;
  let fixture: ComponentFixture<ReportVentaArqueoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportVentaArqueoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportVentaArqueoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
