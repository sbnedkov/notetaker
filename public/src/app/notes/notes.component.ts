import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, catchError, map, switchMap, tap, } from 'rxjs';

import { environment } from '../../environments/environment';
import { BaseComponent } from '../base.component'

@Component({
    selector: 'app-notes',
    templateUrl: './notes.component.html',
    styleUrls: ['../app.component.css', './notes.component.css'],
    standalone: false,
})
export class NotesComponent extends BaseComponent implements OnInit {
    public notes$!: Observable<INote[]>;

    constructor (http: HttpClient, router: Router) {
        super(http, router)
    }

    public override ngOnInit () {
        super.ngOnInit();
        this.notes$ = this.token$.pipe(
            switchMap(token => this.http.get<INote[]>(`${environment.apiUrl}/note`, {
                withCredentials: true,
                headers: {
                    'X-Csrf-Token': token
                },
             })),
             map(response => {
                 if (response) {
                     return response;
                 } else {
                     return []
                 }
             }),
             catchError((err) => {
                 console.error(err)
                 return []
             }),
        );
    }

    public logout () {
        this.token$.pipe(
            switchMap(token => this.http.get<{ ok: boolean }>(`${environment.apiUrl}/note`, {
                    withCredentials: true,
                    headers: {
                        'X-Csrf-Token': token
                    },
                }),
            ),
            tap((result: { ok: boolean }) =>
                this.router.navigate(['login'])
            ),
        );
    }
}

interface INote {
    _id: string,
    user_id: string
    title: string
    content: string
    creation_date: Date
    tags: string[]
}
