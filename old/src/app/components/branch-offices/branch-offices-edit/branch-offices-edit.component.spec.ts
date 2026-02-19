import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchOfficesEditComponent } from './branch-offices-edit.component';

describe('BranchOfficesEditComponent', () => {
  let component: BranchOfficesEditComponent;
  let fixture: ComponentFixture<BranchOfficesEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BranchOfficesEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BranchOfficesEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
