import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArqueoListComponent } from './arqueo-list.component';

describe('ArqueoListComponent', () => {
  let component: ArqueoListComponent;
  let fixture: ComponentFixture<ArqueoListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArqueoListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArqueoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
