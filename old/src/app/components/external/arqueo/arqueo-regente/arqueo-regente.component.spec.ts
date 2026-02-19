import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArqueoRegenteComponent } from './arqueo-regente.component';

describe('ArqueoRegenteComponent', () => {
  let component: ArqueoRegenteComponent;
  let fixture: ComponentFixture<ArqueoRegenteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArqueoRegenteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArqueoRegenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
