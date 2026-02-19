import { Component } from '@angular/core';

@Component({
    templateUrl: 'dashboard.html'
})

export class DashboardComponent {
    title: string;

    constructor() {
        this.title = 'Sucursal';
     }
}
