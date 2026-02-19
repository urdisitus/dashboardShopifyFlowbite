import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateNitNombreComponent } from './update-nit-nombre.component';

describe('UpdateNitNombreComponent', () => {
  let component: UpdateNitNombreComponent;
  let fixture: ComponentFixture<UpdateNitNombreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateNitNombreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateNitNombreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
