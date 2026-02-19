import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CampanaArqueoComponent } from './campana-arqueo.component';

describe('CampanaArqueoComponent', () => {
  let component: CampanaArqueoComponent;
  let fixture: ComponentFixture<CampanaArqueoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CampanaArqueoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CampanaArqueoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
