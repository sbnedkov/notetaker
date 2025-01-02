import { Component, AfterContentInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
//    styles: ['.loginform { display: none; }'],
    styleUrls: ['./login.component.css', '../app.component.css'],
    standalone: true,
})
export class LoginComponent implements AfterContentInit {
    title = 'NoteTaker';
    public loading = true;
    public loginAction = 'http://localhost:31313/login'; // TODO

    constructor (private http: HttpClient) {
    }

    ngAfterContentInit () {
        this.loading = false;
    }
}
