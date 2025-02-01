import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, switchMap, tap } from 'rxjs';

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

    public logout () {
        this.request<{ ok: boolean }>('get', 'logout')
            .subscribe((result: { ok: boolean }) => {
                if (result.ok) {
                    this.router.navigate(['login'])
                }
            });
    }

    public request<C>(method: string, url: string, body: any = {}): Observable<C> {
        return this.token$.pipe(
            switchMap(token => this.http.request<C>(method, `${environment.apiUrl}/${url}`, {
                    body,
                    withCredentials: true,
                    headers: {
                        'X-Csrf-Token': token
                    },
                }),
            ),
        );
    }
}

export interface INote {
    _id: string,
    user_id: string
    title: string
    content: string
    creation_date: Date
    tags: string[]
}
