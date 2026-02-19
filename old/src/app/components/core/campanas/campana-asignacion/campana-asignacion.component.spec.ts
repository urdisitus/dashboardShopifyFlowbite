import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CampanaAsignacionComponent } from './campana-asignacion.component';

describe('CampanaAsignacionComponent', () => {
  let component: CampanaAsignacionComponent;
  let fixture: ComponentFixture<CampanaAsignacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CampanaAsignacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CampanaAsignacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
