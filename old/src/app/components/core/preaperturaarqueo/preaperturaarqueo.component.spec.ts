import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreaperturaarqueoComponent } from './preaperturaarqueo.component';

describe('PreaperturaarqueoComponent', () => {
  let component: PreaperturaarqueoComponent;
  let fixture: ComponentFixture<PreaperturaarqueoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreaperturaarqueoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreaperturaarqueoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
