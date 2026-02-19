import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryNotificationComponent } from './history-notification.component';

describe('HistoryNotificationComponent', () => {
  let component: HistoryNotificationComponent;
  let fixture: ComponentFixture<HistoryNotificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoryNotificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoryNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
