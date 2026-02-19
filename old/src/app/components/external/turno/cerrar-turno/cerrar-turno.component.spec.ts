import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CerrarTurnoComponent } from './cerrar-turno.component';

describe('CerrarTurnoComponent', () => {
  let component: CerrarTurnoComponent;
  let fixture: ComponentFixture<CerrarTurnoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CerrarTurnoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CerrarTurnoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
