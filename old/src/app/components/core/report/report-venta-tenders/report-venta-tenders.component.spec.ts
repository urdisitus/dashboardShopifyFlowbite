import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportVentaTendersComponent } from './report-venta-tenders.component';

describe('ReportVentaTendersComponent', () => {
  let component: ReportVentaTendersComponent;
  let fixture: ComponentFixture<ReportVentaTendersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportVentaTendersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportVentaTendersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
