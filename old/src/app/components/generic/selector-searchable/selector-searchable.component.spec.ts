import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectorSearchableComponent } from './selector-searchable.component';

describe('SelectorSearchableComponent', () => {
  let component: SelectorSearchableComponent;
  let fixture: ComponentFixture<SelectorSearchableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectorSearchableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectorSearchableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
