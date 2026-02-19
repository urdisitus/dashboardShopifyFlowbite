import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostVoidInvoiceComponent } from './post-void-invoice.component';

describe('PostVoidInvoiceComponent', () => {
  let component: PostVoidInvoiceComponent;
  let fixture: ComponentFixture<PostVoidInvoiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostVoidInvoiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostVoidInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
