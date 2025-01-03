import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css', '../app.component.css'],
    standalone: false,
})
export class LoginComponent implements OnInit {
    title = 'NoteTaker';
    public loginAction = 'http://localhost:31313/login'; // TODO
    public loadingClass = 'loading'
    public loading = true;

    constructor (private http: HttpClient) {
    }

    ngOnInit () {
        this.loading = false;
        this.loadingClass = 'loaded';
    }
}
