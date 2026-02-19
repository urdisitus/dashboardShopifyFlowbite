import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReconteoComponent } from './reconteo.component';

describe('ReconteoComponent', () => {
  let component: ReconteoComponent;
  let fixture: ComponentFixture<ReconteoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReconteoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReconteoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
