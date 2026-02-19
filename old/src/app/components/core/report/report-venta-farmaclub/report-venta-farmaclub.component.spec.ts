import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportVentaFarmaclubComponent } from './report-venta-farmaclub.component';

describe('ReportVentaFarmaclubComponent', () => {
  let component: ReportVentaFarmaclubComponent;
  let fixture: ComponentFixture<ReportVentaFarmaclubComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportVentaFarmaclubComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportVentaFarmaclubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
