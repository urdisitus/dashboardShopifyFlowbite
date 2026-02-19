import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuscarClientComponent } from './buscar-client.component';

describe('BuscarClientComponent', () => {
  let component: BuscarClientComponent;
  let fixture: ComponentFixture<BuscarClientComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuscarClientComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuscarClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
