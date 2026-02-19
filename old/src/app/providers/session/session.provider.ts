import { LocalStorageService, SessionStorageService, LocalStorage, SessionStorage } from 'angular-web-storage';
import { Injectable } from "@angular/core";
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root',
})

export class SessionProvider {
    private UserInfoKey: string = 'UserInfoKey';
    private UserRemindKey: string = 'UserRemindKey';
    private MenuStateKey: string = 'MenuStateKey';
    private MenuColorKey: string = 'MenuColorKey';
    private ThemeKey: string = 'ThemeKey';
    private RtlKey: string = 'RtlKey';
    //private TipoFacturacion: string = 'TipoFacturacion';

    constructor(
        public router: Router,
        public local: LocalStorageService,
        private session: SessionStorageService) {
        this.UserInfoKey = `${location.origin}.UserInfoKey`;
        this.UserRemindKey = `${location.origin}.UserRemindKey`;
        this.MenuStateKey = `${location.origin}.MenuStateKey`;
        this.MenuColorKey = `${location.origin}.MenuColorKey`;
        this.ThemeKey = `${location.origin}.ThemeKey`;
        this.RtlKey = `${location.origin}.RtlKey`;
      /*  this.TipoFacturacion = `${location.origin}.TipoFacturacion`;*/
    }

    setUserInfo(userInfo: IUserInfo): Promise<IUserInfo> {
        const now = new Date()
        const object = {
            value: userInfo,
            expiry: now.getTime() + (1000 * 60 * 60)
        };
        return new Promise((resolve) => {
            this.local.set(this.UserInfoKey, object);
            resolve(userInfo);
        });
    }

    getUserInfo(preventLogin: boolean = false): Promise<IUserInfo> {
        return new Promise((resolve) => {
            const now = new Date()
            const item = this.local.get(this.UserInfoKey);
            if (item) {
                if (now.getTime() > item.expiry) {
                    this.local.set(this.UserInfoKey, null);
                    if (!preventLogin) {
                        this.router.navigate(['/login']);
                    }
                } else {
                    let value = item.value;
                    if (value) {
                        this.setUserInfo(value);
                    } else if (!preventLogin) {
                        this.router.navigate(['/login']);
                    }
                    resolve(value);
                    return;
                }
            }
            if (!preventLogin) {
                this.router.navigate(['/login']);
            }
            resolve(null);
        });
    }

    setUserRemind(userName: string): Promise<string> {
        return new Promise((resolve) => {
            this.local.set(this.UserRemindKey, userName);
            resolve(userName);
        });
    }

    getUserRemind(): Promise<string> {
        return new Promise((resolve) => {
            resolve(this.local.get(this.UserRemindKey));
        });
    }

    setMenuState(value: boolean): Promise<boolean> {
        return new Promise((resolve) => {
            this.local.set(this.MenuStateKey, value);
            resolve(value);
        });
    }

    getMenuState(): Promise<boolean> {
        return new Promise((resolve) => {
            resolve(this.local.get(this.MenuStateKey));
        });
    }

    setMenuColor(value: string): Promise<string> {
        return new Promise((resolve) => {
            this.local.set(this.MenuColorKey, value);
            resolve(value);
        });
    }

    getMenuColor(): Promise<string> {
        return new Promise((resolve) => {
            resolve(this.local.get(this.MenuColorKey));
        });
    }

    setTheme(value: string): Promise<string> {
        return new Promise((resolve) => {
            this.local.set(this.ThemeKey, value);
            resolve(value);
        });
    }

    getTheme(): Promise<string> {
        return new Promise((resolve) => {
            resolve(this.local.get(this.ThemeKey));
        });
    }

    setRtl(value: boolean): Promise<boolean> {
        return new Promise((resolve) => {
            this.local.set(this.RtlKey, value);
            resolve(value);
        });
    }

    getRtl(): Promise<boolean> {
        return new Promise((resolve) => {
            resolve(this.local.get(this.RtlKey));
        });
    }

    closeSession(): Promise<boolean> {
        return new Promise((resolve) => {
            this.setUserInfo(null).then((res) => {
                if (res == null) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            });
        });
    }

    setData(key: string, value: any) {
        this.local.set(key, JSON.stringify(value));
    }
    getData<T>(key: string): T {
        return JSON.parse(this.local.get(key));
    }
}
