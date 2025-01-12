import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs'

import { environment } from '../../environments/environment';
import { BaseComponent } from '../base.component'

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['../app.component.css', './login.component.css'],
    standalone: false,
})
export class LoginComponent extends BaseComponent {
    public loginAction = `${environment.apiUrl}/login`;
    public username!: string
    public password!: string

    constructor (http: HttpClient, router: Router) {
        super(http, router)
    }

    public login (username: string, password: string) {
        const subscription = this.token$.pipe(switchMap(token =>
            this.http.post<{ ok: boolean }>(this.loginAction, {
                username,
                password,
            }, {
                withCredentials: true,
                headers: {
                    'X-Csrf-Token': token
                },
            }),
        )).subscribe((result: { ok: boolean }) => {
            this.router.navigate([''], { queryParams: { logged: result.ok } });
            subscription.unsubscribe();
        });
    }
}
