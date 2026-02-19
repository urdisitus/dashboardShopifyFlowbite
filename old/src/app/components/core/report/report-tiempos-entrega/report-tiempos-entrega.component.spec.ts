import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportTiemposEntregaComponent } from './report-tiempos-entrega.component';

describe('ReportTiemposEntregaComponent', () => {
  let component: ReportTiemposEntregaComponent;
  let fixture: ComponentFixture<ReportTiemposEntregaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportTiemposEntregaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportTiemposEntregaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
