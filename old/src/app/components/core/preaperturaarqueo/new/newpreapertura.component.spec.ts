import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPreaperturaComponent } from './newpreapertura.component';

describe('NewPreaperturaComponent', () => {
  let component: NewPreaperturaComponent;
  let fixture: ComponentFixture<NewPreaperturaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NewPreaperturaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewPreaperturaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
