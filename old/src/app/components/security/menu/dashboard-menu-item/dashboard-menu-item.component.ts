import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: '[appDashboardMenuItem]',
  templateUrl: './dashboard-menu-item.component.html',
  styleUrls: ['./dashboard-menu-item.component.css']
})
export class DashboardMenuItemComponent implements OnInit {

  @Input() public menu: IDashboardMenu;

  constructor() {

  }

  public ngOnInit(): void {
  }
}
