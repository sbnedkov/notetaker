import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../environments/environment';

@Component({
    template: '',
    styleUrls: ['./app.component.css'],
})
export abstract class BaseComponent implements OnInit {
    protected token!: string;
    public loadingClass = 'loading'
    public loading = true;

    constructor (protected http: HttpClient, protected router: Router) {
    }

    public ngOnInit() {
        const subscription = this.http.get<string>(`${environment.apiUrl}/csrf`, {
            withCredentials: true,
        }).subscribe(token => {
            this.token = token;
            subscription.unsubscribe();

            this.loading = false;
            this.loadingClass = 'loaded';
        });
    }
}
