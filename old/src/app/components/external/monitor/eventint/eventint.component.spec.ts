import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventintComponent } from './eventint.component';

describe('EventintComponent', () => {
  let component: EventintComponent;
  let fixture: ComponentFixture<EventintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
