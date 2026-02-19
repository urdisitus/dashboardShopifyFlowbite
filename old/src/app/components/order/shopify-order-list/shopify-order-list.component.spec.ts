import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopifyOrderListComponent } from './shopify-order-list.component';

describe('OrderListComponent', () => {
  let component: ShopifyOrderListComponent;
  let fixture: ComponentFixture<ShopifyOrderListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShopifyOrderListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShopifyOrderListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
