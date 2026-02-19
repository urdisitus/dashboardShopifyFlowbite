import { Component, OnInit, Input } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-dashboard-menu',
  templateUrl: './dashboard-menu.component.html',
  styleUrls: ['./dashboard-menu.component.css']
})
export class DashboardMenuComponent implements OnInit {

  @Input() public menu: IDashboardMenu[];
  public systemName: string;
  constructor(
    public router: Router) {
    this.systemName = environment.systemName;
  }

  private updateMenuFields(menu: IDashboardMenu, url: string, urlAfterRedirects: string): void {
    menu.dropdown = menu.childrens && menu.childrens.length > 0;
    menu.active = menu.route == url;
    menu.active = menu.active;
    if (menu.route === '#') {
      menu.route = null;
    }
    if (menu.childrens) {
      for (let index = 0; index < menu.childrens.length; index++) {
        let element = menu.childrens[index];
        this.updateMenuFields(element, url, urlAfterRedirects);
        menu.active = menu.active || menu.active;
      }
    } else {
      menu.childrens = [];
    }
    menu.liClass = this.liClass(menu);
    menu.aClass = this.aClass(menu);
  }

  public removeIcons(menu: IDashboardMenu, level: number = 0): void {
    if (menu.icon && level > 0) {
      menu.icon = null;
    }
    if (!menu.childrens) {
      menu.childrens = [];
    }
    menu.childrens.forEach(element => {
      this.removeIcons(element, level + 1);
    });
  }

  public ngOnInit(): void {
    this.router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        this.menu.forEach(element => {
          this.updateMenuFields(element, val.url, val.urlAfterRedirects)
        });
      }
    });
    this.menu.forEach(element => {
      this.removeIcons(element);
      this.updateMenuFields(element, this.router.url, this.router.url);
    });
  }

  public liClass(menu: IDashboardMenu): string {
    let active: string = ' li-active-menu';
    if (!menu.active) {
      active = ' ';
    }
    if (menu.dropdown) {
      return 'nav-item dropdown' + active;
    } else {
      return 'nav-item' + active;
    }
  }

  public aClass(menu: IDashboardMenu): string {
    let active: string = ' a-active-menu';
    if (!menu.active) {
      active = ' ';
    }
    if (menu.dropdown) {
      return 'dropdown-toggle' + active;
    } else {
      return active;
    }
  }
}
