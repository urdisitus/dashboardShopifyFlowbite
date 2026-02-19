import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShoweventintComponent } from './showeventint.component';

describe('ShoweventintComponent', () => {
  let component: ShoweventintComponent;
  let fixture: ComponentFixture<ShoweventintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShoweventintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShoweventintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
