import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ItemMatchCodeListComponent } from './item_match_code_list.component';

describe('ItemMatchCodeComponent', () => {
  let component: ItemMatchCodeListComponent;
  let fixture: ComponentFixture<ItemMatchCodeListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ItemMatchCodeListComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemMatchCodeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
