import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WmseventintComponent } from './wmseventint.component';

describe('WmseventintComponent', () => {
  let component: WmseventintComponent;
  let fixture: ComponentFixture<WmseventintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WmseventintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WmseventintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
