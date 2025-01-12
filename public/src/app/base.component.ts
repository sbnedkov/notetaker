import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

import { environment } from '../environments/environment';

@Component({
    template: '',
})
export abstract class BaseComponent implements OnInit {
    protected token$!: Observable<string>;
    public loadingClass = 'loading';

    constructor (protected http: HttpClient, protected router: Router) {
    }

    public ngOnInit() {
        this.token$ = this.http.get<string>(`${environment.apiUrl}/csrf`, {
            withCredentials: true,
        });

        this.loadingClass = 'loaded';
    }
}
