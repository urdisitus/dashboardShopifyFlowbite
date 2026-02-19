import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArqueoVoucherComponent } from './arqueo-voucher.component';

describe('ArqueoVoucherComponent', () => {
  let component: ArqueoVoucherComponent;
  let fixture: ComponentFixture<ArqueoVoucherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArqueoVoucherComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArqueoVoucherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
