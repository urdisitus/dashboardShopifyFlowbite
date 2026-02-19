import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PoligonoComponent } from './poligono.component';

describe('PoligonoComponent', () => {
  let component: PoligonoComponent;
  let fixture: ComponentFixture<PoligonoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PoligonoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PoligonoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
