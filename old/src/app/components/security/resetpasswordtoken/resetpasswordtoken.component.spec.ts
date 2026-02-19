import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetpasswordtokenComponent } from './resetpasswordtoken.component';

describe('ResetpasswordtokenComponent', () => {
  let component: ResetpasswordtokenComponent;
  let fixture: ComponentFixture<ResetpasswordtokenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResetpasswordtokenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResetpasswordtokenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
