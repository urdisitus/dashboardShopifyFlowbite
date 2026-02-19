import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportVentaCreditoComponent } from './report-venta-credito.component';

describe('ReportVentaCreditoComponent', () => {
  let component: ReportVentaCreditoComponent;
  let fixture: ComponentFixture<ReportVentaCreditoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportVentaCreditoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportVentaCreditoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
