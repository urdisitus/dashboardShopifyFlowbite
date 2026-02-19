import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BarnchOfficeListComponent } from './barnch-office-list.component';

describe('BarnchOfficeListComponent', () => {
  let component: BarnchOfficeListComponent;
  let fixture: ComponentFixture<BarnchOfficeListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BarnchOfficeListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BarnchOfficeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
