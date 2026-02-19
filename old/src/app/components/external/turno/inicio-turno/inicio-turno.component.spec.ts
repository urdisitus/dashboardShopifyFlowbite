import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InicioTurnoComponent } from './inicio-turno.component';

describe('InicioTurnoComponent', () => {
  let component: InicioTurnoComponent;
  let fixture: ComponentFixture<InicioTurnoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InicioTurnoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InicioTurnoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
